const express = require("express")
const router = express.Router()

const TagController = require("../controller/tag")

const { authMiddleware } = require("../middleware/admin/auth.middleware")


//获取所有标签
router.get("/", TagController.getTags)
//创建标签
router.post("/", authMiddleware, TagController.createTags)

module.exports = router