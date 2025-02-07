const { auction } = require("../models/auction")
const {user} = require("../models/users")
const {bid} = require("../models/bid")
const storage = require("../storage/storage")
const {dependencyContainer, messageAllWebsockets} = require("../utils/utils")
const testService = dependencyContainer.get("test")
const auctionService = require("../services/auction.service")
const bidService = require("../services/bid.service")

class AuctionController{


    async getAuctions(req,res){
        try{
            const auctions = await auction.find({}).populate("bids").sort({ createdAt: -1 });
            res.status(200).json(auctions);
        }catch(e){
            console.log(e)
            res.status(500).send("error caused")
        }
    }
    
    async getOneAuction(req,res){
        try{
            const result = await auction.findOne({hash: req.params.id}).populate("bids")
            // const result = await bid.find().populate("user auction")
            res.status(200).json(result)
        }catch(e){
            console.log(e)
            res.status(500).send("not found")

        }
    }

    async postAuction(req,res){

        try{
            let result =  await auction.insertMany(req.body)
            result.forEach((item) => storage.get("auctions").set(item._id, item))
            console.log(storage)
            res.status(201).json(result)
        }catch(e){
            console.log(e)
            res.status(500).send("error caused")
        }
    }

    async confirmAuctionWinner(req, res){
        // await auctionService.paymentForAuction()
        const auc = await auction.findById(req.params.id)
        auc.status = "completed"
        console.log(auc)
        const result = await auction.findByIdAndUpdate(req.params.id,auc, {new:true})
        res.status(200).json(auc)
    }

    getAuctionsId(auc){
        
    }

    async checkAuctionInStorage(req,res){
        res = []
        let aucs = await auction.find({})
        aucs.forEach((item) => res.push(item._id))
        // console.log(res)
        const auctions = new Set(res)
        auctions.forEach((auc) => {
            
        })
        storage.forEach((val, key) => {
            // console.log(val)
            if(!auctions.has(val)){
                console.log(val, "we dont have this")
            }
        })
    }

    async updateAuction(req,res){
        try{
            const auc = await auction.findByIdAndUpdate(req.params.id, req.body, {new:true})
            res.status(200).send(auc)
        }catch(e){
            console.error(e)
            res.status(500).send("error caused")
        }
    }

    async deleteAuction(req,res){
        try{
            await auction.findOneAndDelete(req.params.id)
            res.status(200).send("success")
        }catch(err){
            console.error(err)
            res.status(500).send("error caused")
        }
    }

    async placeBet(req,res){
        try{
            // const auc = await auction.findById(req.params.id)
            const usr = await user.findById(req.body.userId)
            let bid = {user:req.body.userId, amount:req.body.amount, auction:req.params.id}
            const newBid = await bidService.createBid(bid)
            console.log(newBid)
            const updatedAuction = await auction.findByIdAndUpdate(
                req.params.id,
                { $push: { bids: newBid._id } }, 
                { new: true } 
              );
            // usr.bids.push(bid)
            // console.log(storage)
            // const result = await auction.findByIdAndUpdate(req.params.id,auc)
            await user.updateOne(usr)
            messageAllWebsockets(storage.get("auctionConnections").get(req.params.id), bid)
            res.status(201).json(updatedAuction)
        }catch(e){
            console.log(e)
            res.status(500).send("error caused")
        }
    }

    joinAuction(ws){
        this.connections.set(connectionId, ws)
        this.connectionId++
        console.log(this.connections, "a?")
    }
    
    test(req,res){
        const result =  []
        console.log("dkwaldkwal")
        storage.get("auctionConnections").forEach((val, key) => {
            result.push({id:key, connections:storage.get("auctionConnections").get(key).length})
        })
        res.status(200).json(result)
    }

    handleWs(ws, req){
        auctionService.onConnection(req.params.id, ws)
        ws.on("close", () => auctionService.onClose(req.params.id, ws))
        // ws.on("message", () => ws.send("a"))
    }
}

module.exports = new AuctionController()