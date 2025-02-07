const storage = require("../storage/storage")
const {auction} = require("../models/auction")

class AuctionService{

    #activeAuctionsObserverInterval;

    async activeAuctionsObserver() {
        console.log("started observer");
        setInterval(() => this.#checkActiveAuctions(), 2000);
    }
    
    
    async #checkActiveAuctions() {
        const auctions = storage.get("auctions");
        if (auctions.size === 0) {
            return;
        }

        for (const [key, val] of auctions.entries()) {
            if (val.status !== "active") continue;

            if (val.endTime.getTime() <= new Date().getTime()) {
                console.log("time's up");
                let winner = await this.selectAuctionWinner(val);
                val.status = "waitingForPay";
                const upd = await this.updateAuction(val);
                console.log(val)
                console.log(winner);

                setTimeout(async () => {
                    const auc = await auction.findById(val.id);
                    console.log("updated", auc);
                    if (auc.status === "completed") {
                        console.log("some good logic here");
                        return;
                    }
                    if (auc.blackList.includes(winner.userId)) return;

                    auc.blackList.push(winner.userId);
                    console.log("not paid");
                     await this.updateAuction(auc);
                }, 30*1000);
            }
        }
    }

    async selectAuctionWinner(auctionId){
        let res = {amount:0}
        const auc = await auction.findById(auctionId).populate("bids")
        auc.bids.forEach((item) => {
            if(item.amount >  res.amount)
                res = item
        })
        return res        
    }

        // stopActiveAuctionsObserver() {
        // console.log("stopped observer")
    //    clearInterval(this.#activeAuctionsObserverInterval)
    // }



    async paymentForAuction(){
        return true
    }

    async getAuctions(req,res){
        const result = await auction.find().populate("winner")
    }

    async updateAuction(auc){
        console.log(auc._id)
        const newAuc = await auction.findByIdAndUpdate(auc._id, auc, {new: true}) 
        const storageAuc = storage.get("auctions").set(auc._id, newAuc)
        return {auc:newAuc, storageAuc:storageAuc}
    }

    handleWs(ws,aucId){
        this.onConnection()
        ws.on("close", () => this.onClose(aucId, ws))

    }



    onConnection(aucId, ws){
        console.log("connected")
        const connections = storage.get("auctionConnections")
        if(connections.get(aucId))
            connections.set(aucId, [...storage.get(aucId),ws])
        else
        connections.set(aucId, [ws])
        console.log(connections.get(aucId))
    }

    onClose(aucId, ws){
        console.log('closed')
        const connections = storage.get("auctionConnections")
        let arr = connections.get(aucId)
        connections.set(aucId, arr.filter((item) => item != ws))
    }
}

module.exports = new AuctionService