const express = require("express")
const router = express.Router()

const UserController = require("../controller/users")
const { authMiddleware } = require("../middleware/admin/auth.middleware")


//获取用户
router.get("/", authMiddleware, UserController.getUser)
//创建用户
router.post("/create", UserController.createUser)
//登陆
router.post("/login", UserController.login)
//更新用户
router.patch("/", authMiddleware, UserController.updateUser)  //patch局部更新

module.exports = router