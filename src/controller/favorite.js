

const HttpException = require("../exceptions/http.exception")
const Article = require("../models/article")
const Tag = require("../models/tag")


function handleFavorite(article, author, count) {
    //处理tags，返回一个数组
    article.dataValues.tags = article.dataValues.tags.map(val => val.name)
    //还需要作者信息修改和添加
    delete author.dataValues.password
    delete author.dataValues.email
    article.dataValues.author = author.dataValues
    //喜欢的数量
    article.dataValues.favoriteCount = count
    article.dataValues.favorited = true
}

//添加喜欢
module.exports.addFavorite = async (req, res, next) => {
    try {
        //获取参数(文章)
        let { slug } = req.params
        //获取文章
        let article = await Article.findByPk(slug, { include: Tag })
        if (!article) {
            throw new HttpException(404, "喜欢的文章不存在", "article is not found")
        }
        //添加被喜欢的用户
        //文章可以被多个人喜欢，
        await article.addUsers(req.user.email)

        //获取文章作者
        let author = await article.getUser()
        //获取喜欢的个数
        let count = await article.countUsers()
        handleFavorite(article, author, count)

        res.status(200).json({
            status: 1,
            message: "喜欢成功",
            data: article.dataValues
        })
    } catch (error) {
        next(error)
    }
}

//取消喜欢
module.exports.removeFavorite = async (req, res, next) => {
    try {
        //获取参数(文章)
        let { slug } = req.params
        //获取文章
        let article = await Article.findByPk(slug, { include: Tag })
        if (!article) {
            throw new HttpException(404, "喜欢的文章不存在", "article is not found")
        }
        //删除被喜欢的用户
        //文章可以被多个人喜欢，
        await article.removeUsers(req.user.email)

        //获取文章作者
        let author = await article.getUser()
        //获取喜欢的个数
        let count = await article.countUsers()
        handleFavorite(article, author, count)

        res.status(200).json({
            status: 1,
            message: "取消喜欢成功",
            data: article.dataValues
        })
    } catch (error) {
        next(error)
    }
}