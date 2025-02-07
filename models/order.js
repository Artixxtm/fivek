const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    items: [
      {
        title: { type: String, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["processing", "canceled", "completed"],
      default: "processing",
    },
    invoiceId: {type: String},
    orderId: {type: String},
    createdAt: { type: Date, default: Date.now },
});

const order = mongoose.model('Order', OrderSchema);
module.exports = {order}
