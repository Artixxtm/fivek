
const express = require("express") 
const expressWs = require('express-ws') 

expressWs(express())
const router = express.Router()
const AuctionController = require("../controllers/auction.controller")

router.get("/", AuctionController.getAuctions)
router.post("/", AuctionController.postAuction)
router.get("/:id", AuctionController.getOneAuction)
router.put("/:id", AuctionController.updateAuction)
router.get("/qa", (req,res) => res.status(200).send("ok"))
router.post("/place-bet/:id", AuctionController.placeBet)
router.delete("/:id", AuctionController.deleteAuction)
router.post("/connections", AuctionController.test)
router.post("/confirm/:id", AuctionController.confirmAuctionWinner)

router.ws("/:id", AuctionController.handleWs)
module.exports = router