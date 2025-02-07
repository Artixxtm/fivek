
const router = require("express").Router()
const GalleryProductContoller = require("../controllers/galleryProduct.controller")

router.get('/', GalleryProductContoller.getProducts)
router.post("/", GalleryProductContoller.postProduct)
router.put("/:id", GalleryProductContoller.updateProduct)
router.get("/:id", GalleryProductContoller.getOneProduct)
router.get("/test", GalleryProductContoller.test)
router.delete("/:id", GalleryProductContoller.deleteProduct)

module.exports = router