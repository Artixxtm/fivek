const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AuctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startPrice: { type: Schema.Types.Double, required: true },
    hash:{type: String},
    dimensions:{type: String},
    images: [],
    video: {type: String },
    minPrice: {type: Schema.Types.Double},
    maxPrice: {type: Schema.Types.Double},
    delivery: {type: String},
    endTime: {type: String},
    currentPrice: { type: Number, default: 0 },
    bids: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
    ],
    startTime: { type: Date, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', "waitingForPay",'completed'], default: 'active' },
    blackList: []
});
const auction = mongoose.model('Auction', AuctionSchema);
module.exports = {auction}