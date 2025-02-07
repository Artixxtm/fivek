
const router = require("express").Router()
const ProductController = require("../controllers/product.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get('/', ProductController.getProducts)
router.post("/", authMiddleware, ProductController.postProduct)
router.put("/:id", ProductController.updateProduct)
router.get("/:id", ProductController.getOneProduct)
// router.get("/test", ProductController.test)
router.delete("/:id", ProductController.deleteProduct)

module.exports = router