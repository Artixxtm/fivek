const crypto = require("crypto");

const axios = require("axios");
const { order } = require("../models/order");
const { user } = require("../models/users");

class PaymentController {
  async createInvoiceBTC(req, res, next) {
    try {
      const { totalPrice, itemsPurchased, userId } = req.body;

      if (!itemsPurchased?.length || !totalPrice)
        return res.status(500).json({
          success: false,
          message: "Provide required data: itemsPurchased and totalPrice.",
        });
      if (!userId)
        return res.status(500).json({
          success: false,
          message: "Create or login to your account.",
        });

      let orderId = crypto.randomUUID();
      const invoiceData = {
        metadata: {
          orderId,
          itemDesc: "5KSANA Shop",
        },
        checkout: {
          redirectURL: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
        },
        amount: totalPrice,
        currency: "BTC",
      };

      const response = await axios.post(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.BTCPAY_API_KEY}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const {checkoutLink, id: invoiceId} = response.data;
        console.log(response.data)

        const foundUser = await user.findById(userId);
        if (!foundUser)
          return res
            .status(500)
            .json({ success: false, message: "User not found." });

        const newOrder = await order.create({
          items: itemsPurchased.map((item) => ({
            title: item.title,
            product: item._id,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          totalPrice,
          payer: userId,
          status: "processing",
          orderId,
          invoiceId,
        });

        foundUser.orders.push(newOrder._id);
        await foundUser.save();

        return res.json({ success: true, checkoutLink });
      }
    } catch (error) {
      console.error("BTCPay error:", error.response?.data || error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error creating invoice" });
    }
  }

  async webhookStatus(req, res, next) {
    try {
      const event = req.body;
      console.log("Webhook received:", event);
  
      const invoiceId = event.id;
  
      // Check if the event is an invoice being settled (paid)
      if (event.type === "InvoiceSettled") {
        console.log(`✅ Invoice ${invoiceId} was paid!`);
  
        // Find the order in your database using invoiceId
        const foundOrder = await order.findOne({ invoiceId });
        if (!foundOrder) {
          return res.status(404).json({ success: false, message: "Order not found." });
        }
  
        // Update order status to "completed"
        foundOrder.status = "completed";
        await foundOrder.save();
  
        return res.status(200).json({ success: true, message: "Order updated." });
      }
  
      // Handle expired or failed invoices
      if (event.type === "InvoiceExpired" || event.type === "InvoiceInvalid") {
        console.log(`❌ Invoice ${invoiceId} expired or failed.`);
  
        const foundOrder = await order.findOne({ invoiceId });
        if (foundOrder) {
          foundOrder.status = "canceled";
          await foundOrder.save();
        }
  
        return res.status(200).json({ success: true, message: "Order status expired or failed." })
      }
  
      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Error processing webhook");
    }
  }

  async checkStatus(req, res, next) {
    try {
      console.log(orderId)
      const foundOrder = await order.findOne({ orderId });
  
      if (!foundOrder) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }
  
      return res.json({ success: true, status: foundOrder.status });
    } catch (error) {
      console.error("Error fetching order status:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new PaymentController();
