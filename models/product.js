const mongoose = require("mongoose");
const Joi = require("joi")
const Schema = mongoose.Schema;



const ProductSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	price: { type: Schema.Types.Double, required: true },
	video: {type: String},
	images: [],
	createdAt: { type: Date, default: Date.now },
	dimensions: {type: String},
	delivery: {type: String},
    hash: {type:String},
  });

  const productValidate = Joi.object({
	name: Joi.string().required(),
	description: Joi.string(),
	price: Joi.number().required(),
	image: Joi.string(),
	createdAt: Joi.date().default(Date.now())
  }) 
  

const product = mongoose.model('Product', ProductSchema);
module.exports = {product, productValidate}