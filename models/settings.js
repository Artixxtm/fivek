const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: { type: String, default: undefined},
  description: { type: String, default: undefined },
  images: [
    {
      name: { type: String, default: undefined },
      src: { type: String, default: undefined },
    },
  ],
  list: [{ type: String, default: undefined }],
});

const PageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sections: [SectionSchema],
});

const SettingsSchema = new mongoose.Schema(
  {
    contactEmail: { type: String },
    telegramChatId: { type: String },
  },
  {
    capped: {
      max: 1,
    },
  }
);

const Page = mongoose.model("Page", PageSchema);
const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = { Page, Settings };
