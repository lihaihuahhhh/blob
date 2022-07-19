const express = require("express")
const router = express.Router()

const ArticleController = require("../controller/articles")
const { authMiddleware } = require("../middleware/admin/auth.middleware")


//传过来的是需要关注的对方

//创建文章
router.post("/", authMiddleware, ArticleController.createArticle)
//条件获取全局文章
router.get("/",  ArticleController.getArticles)
//获取单个文章
router.get("/:slug", authMiddleware, ArticleController.getArticle)
//获取关注的文章
router.post("/follow", authMiddleware, ArticleController.getFollowArticle)
//更新文章
router.put("/:slug", authMiddleware, ArticleController.updateArticles)
//删除文章
router.delete("/:slug", authMiddleware, ArticleController.deleteArticles)


module.exports = router