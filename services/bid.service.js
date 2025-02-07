const { bid } = require("../models/bid")

class BidsService{
    async createBid(bidData){
        return await bid.create(bidData)
    }

    async getBids(){
        return await bid.find().populate("auction")
       
    }



}

module.exports = new BidsService