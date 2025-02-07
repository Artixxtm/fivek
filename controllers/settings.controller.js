const settingsService = require("../services/settings.service");

class SettingsController {
  async getSettings(req, res) {
    try {
      const page = await settingsService.getSettings(req.params.id);
      if (!page) return res.status(404).send("not found");
      res.status(200).json(page);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async createSettings(req, res) {
    try {
      const result = await settingsService.createSettings(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async updateSettings(req, res) {
    try {
      console.log("Dwa;ldaw;");
      const result = await settingsService.updateSettings(req.body);
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }
}

module.exports = new SettingsController();
