
const router = require("express").Router()
const PaymentController = require("../controllers/payment.controller")

router.post('/create-invoice-btc', PaymentController.createInvoiceBTC);
router.post('/webhook', PaymentController.webhookStatus)

router.get("/status/:orderId", PaymentController.checkStatus);
  


module.exports = router