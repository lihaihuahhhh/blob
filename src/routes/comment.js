
const express = require("express")
const router = express.Router()

const CommentController = require("../controller/comment")
const { authMiddleware } = require("../middleware/admin/auth.middleware")



//创建评论
router.post("/:slug/comment", authMiddleware, CommentController.createComment)

//获取评论
router.get("/:slug/comments", authMiddleware, CommentController.getComments)

//删除评论
router.delete("/:slug/comment/:id", authMiddleware, CommentController.removeComment)





module.exports = router