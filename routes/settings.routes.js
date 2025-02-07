const router = require("express").Router()
const SettingsController = require("../controllers/settings.controller")


router.get("/:id", SettingsController.getSettings)
router.post("/", SettingsController.createSettings)
router.put("/", SettingsController.updateSettings)

module.exports = router