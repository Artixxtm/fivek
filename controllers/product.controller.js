const { product, productValidate } = require("../models/product")
const productService = require("../services/product.service")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
  }).single('file');

class ProductController{
    async getProducts(req,res){
        try{
            const products = await product.find({}).sort({ createdAt: -1 });
            res.send(products);
        }catch(e){
            res.status(400).send("error caused")
        }
    }

    
    async getOneProduct(req,res){
        try{
            const foundProduct = await product.findOne({hash: req.params.id})
            return res.status(200).json(foundProduct);
        }catch(e){
            return res.status(500).send("not found")
        }
    }

    async postProduct(req,res){
        try{
            const imgUrls = await productService.uploadImage(req.body.images)
            console.log(imgUrls)
            delete req.body.images
            if(imgUrls) req.body.images = imgUrls;
            const products = await product.insertMany(req.body)
            res.status(201).json(products)
        }catch(e){
            console.log(e)
            res.status(500).send("error caused")
        }
    }


    async updateProduct(req,res){
        try{
            const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, {new:true})
            res.status(200).json(updatedProduct)
        }catch(e){
            console.error(e)
            res.status(500).send("error caused")
        }
    }

    async deleteProduct(req,res){
        try{
            await product.findOneAndDelete(req.params.id)
            res.status(200).send("success")
        }catch(err){
            console.error(err)
            res.status(500).send("error caused")
        }
    }

    async test(req,res){
        res.send(product.schema)
    }
}

module.exports = new ProductController()