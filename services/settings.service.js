const {settings, Page} = require("../models/settings")

class SettingsService{
    async createSettings(settingsData){
        return await settings.create(settingsData)
    }

    async getSettings(name) {
        const idk = await Page.findOne({ name });
        return idk
    }
    

    async updateSettings(entityData){

        let entity = await settings.find()[0]
        console.log(entity)
        entity = entityData
        return await settings.updateOne(entity)
    }

    async addSiteTexts(texts){
        let entity = await settings.find()[0]
        for(let text in texts){
            entity["siteTexts"][text] = texts[text]
        }
        return await settings.updateOne(entity)
    }

}

module.exports = new SettingsService