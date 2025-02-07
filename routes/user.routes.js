
const router = require("express").Router()
const UserController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const passport = require("passport")
require("../utils/auth")

router.post("/auth/google", UserController.googleAuth)

router.get("/", UserController.getUsers)
router.post("/register", UserController.registration)
router.post("/login", UserController.login)
router.get("/secure", authMiddleware, UserController.getUsers)
router.get("/refresh", UserController.refresh)
router.get("/:id", UserController.getOneUser)
router.get('/activate/:link', UserController.activate);
router.put("/logout", UserController.logout)
// router.get("/test", ProductController.test)
// router.delete("/:id", ProductController.deleteProduct)

module.exports = router