

const HttpException = require("../exceptions/http.exception")
const Article = require("../models/article")
const User = require("../models/user")
const Comment = require("../models/comment")


function handleComment(comment, author, article) {
    //还需要作者信息修改和添加
    delete author.dataValues.password
    delete author.dataValues.email
    comment.dataValues.author = author.dataValues
    comment.dataValues.article = article.dataValues
}

//创建评论
module.exports.createComment = async (req, res, next) => {
    try {
        //获取参数
        let { slug } = req.params
        let { body } = req.body.comment
        //参数验证

        //获取文章，文章不存在就返回
        let article = await Article.findByPk(slug)
        if (!article) {
            throw new HttpException(404, "评论文章不存在", "article not exist")
        }
        //获取评论用户
        let user = await User.findByPk(req.user.email)
        if (!user) {
            throw new HttpException(404, "评论用户不存在", "user not exist")
        }
        //创建评论和用户以及文章的关系
        let newComment = await Comment.create({ body })
        //都是一对多的关系
        await user.addComments(newComment)
        await article.addComments(newComment)
        handleComment(newComment, user, article)

        res.status(200).json({
            status: 1,
            message: "评论成功",
            data: newComment.dataValues
        })
    } catch (error) {
        next(error)
    }
}

//获取文章评论列表
module.exports.getComments = async (req, res, next) => {
    try {
        //获取参数
        let { slug } = req.params
        //参数验证

        //获取文章，文章不存在就返回
        let article = await Article.findByPk(slug)
        if (!article) {
            throw new HttpException(404, "评论文章不存在", "article not exist")
        }
        //获取评论用户
        let user = await User.findByPk(req.user.email)
        if (!user) {
            throw new HttpException(404, "评论用户不存在", "user not exist")
        }
        //获取评论的列表
        let comments = await Comment.findAll({
            where: {
                articleSlug: slug
            },
            include: [{
                model: User,
                attributes: ["username", "bio", "avatar"]
            }]
        })

        res.status(200).json({
            status: 1,
            message: "获取评论成功",
            data: comments
        })
    } catch (error) {
        next(error)
    }
}

//删除评论,锁定某片文章的一条评论
module.exports.removeComment = async (req, res, next) => {
    try {
        //获取参数
        let { slug, id } = req.params
        //参数验证

        //获取文章，文章不存在就返回
        let article = await Article.findByPk(slug)
        if (!article) {
            throw new HttpException(404, "评论文章不存在", "article not exist")
        }
        //获取评论
        let comment = await Comment.findByPk(id)
        if (!comment) {
            throw new HttpException(404, "评论不存在", "comment not exist")
        }
        //获取评论用户
        let user = await User.findByPk(req.user.email)
        if (!user) {
            throw new HttpException(404, "评论用户不存在", "user not exist")
        }
        //需要验证删除的是不是自己的评论，只有文章作者才可以执行删除
        if (req.user.email !== comment.userEmail) {
            throw new HttpException(401, "当前用户没有删除当前评论的权利", "no authorization")
        }
        //删除评论
        await Comment.destroy({ where: { id } })

        res.status(200).json({
            status: 1,
            message: "删除评论成功"
        })
    } catch (error) {
        next(error)
    }
}
