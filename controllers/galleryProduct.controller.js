const { galleryProduct } = require("../models/galleryProduct")
const productService = require("../services/product.service")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
  }).single('file');

class GalleryProductContoller{
    async getProducts(req,res){
        try{
            const products = await galleryProduct.find({}).sort({ createdAt: -1 });
            res.send(products);
        }catch(e){
            res.status(400).send("error caused")
        }
    }
    
    async getOneProduct(req,res){
        try{
            const foundProduct = await galleryProduct.findOne({hash: req.params.id})
            return res.status(200).json(foundProduct);
        }catch(e){
            return res.status(500).send("not found")
        }
    }

    async postProduct(req,res){
        // const validate = productValidate.validate(req.body)
        // if(validate.error)
            // return res.status(400).send("invalid data")
        // console.log(req.body)
        // productService.uploadImage(req.body.file)
        try{

            const imgUrl = await productService.uploadImage(req.body.file)
            console.log(req.body)
            delete req.body.file
            if(imgUrl)
                req.body.images.push(imgUrl)

            const products = await galleryProduct.insertMany(req.body)
            res.status(201).json(products)
        }catch(e){
            console.log(e)
            res.status(500).send("error caused")
        }
    }

    async updateProduct(req,res){
        try{
            const updatedProduct = await galleryProduct.findByIdAndUpdate(req.params.id, req.body, {new:true})
            res.status(200).json(updatedProduct)
        }catch(e){
            console.error(e)
            res.status(500).send("error caused")
        }
    }

    async deleteProduct(req,res){
        try{
            await galleryProduct.findOneAndDelete(req.params.id)
            res.status(200).send("success")
        }catch(err){
            console.error(err)
            res.status(500).send("error caused")
        }
    }

    async test(req,res){
        res.send(galleryProduct.schema)
    }
}

module.exports = new GalleryProductContoller()