
const express = require("express")
const router = express.Router()

const FavoriteController = require("../controller/favorite")
const { authMiddleware } = require("../middleware/admin/auth.middleware")



//添加喜欢
router.post("/:slug", authMiddleware, FavoriteController.addFavorite)

//取消喜欢
router.delete("/:slug", authMiddleware, FavoriteController.removeFavorite)





module.exports = router