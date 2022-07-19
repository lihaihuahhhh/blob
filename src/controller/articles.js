

const HttpException = require("../exceptions/http.exception")
const User = require("../models/user")
const Article = require("../models/article")
const Tag = require("../models/tag")
const { getSlug } = require("../utils/slug")
let { validateCreateArticle } = require("../utils/validate/article.validate")
const sequelize = require("../db/sequelize")


function handleArticle(article, author) {
    article.dataValues.tags = article.dataValues.tags.map(val => val.name)
    //还需要作者信息
    delete author.dataValues.password
    delete author.dataValues.email
    article.dataValues.author = author.dataValues
}

//创建文章
module.exports.createArticle = async (req, res, next) => {
    try {
        //获取请求的内容
        let { title, description, body, tags } = req.body.article
        //请求内容验证
        let { error, validateResult } = validateCreateArticle(title, description, body, tags)
        if (!validateResult) {
            throw new HttpException(401, "文章创建参数失败", error)
        }
        //获取作者的信息
        let { email } = req.user
        let author = await User.findByPk(email)
        if (!author) {
            throw new HttpException(401, "作者账号不存在", "author user not found")
        }
        //创建文章
        //生成别名
        let slug = getSlug()
        //存储数据，作者和用户email
        let article = await Article.create({
            slug,
            title,
            description,
            body,
            userEmail: author.email
        })
        console.log(11111111111111111111);
        //存储文章和标签的关系
        //自定义标签：当前作者自己添加的标签，文章和标签关系存储
        //系统自带的标签，数据库已经存在的标签。文章和标签关系存储
        if (tags) {
            for (let t of tags) {
                let tag = await Tag.findByPk(t)
                if (!tag) {
                    //说明是自定义的标签，先创建标签
                    let newTag = await Tag.create({ name: t })
                    //建立文章和标签之间的关系
                    //这里的关系建立是基于已经查找出来的数据,可以打印log(article.__proto__)
                    await article.addTag(newTag)
                } else {
                    //直接建立文章和标签之间的关系
                    await article.addTag(tag)
                }
            }
        }

        //返回文章数据,注意这里article是创建的不包含关系
        article = await Article.findByPk(slug, {
            include: [Tag]
        })
        handleArticle(article, author)
        res.status(200).json({
            status: 1,
            message: "文章创建成功",
            data: article.dataValues
        })

    } catch (error) {
        next(error)
    }
}


//获取文章:单个文章
//这里需要返回的数据是用户信息，标签，文章信息
module.exports.getArticle = async (req, res, next) => {
    console.log("getArticle");
    try {
        //获取数据
        let slug = req.params.slug
        //获取文章和标签
        let article = await Article.findByPk(slug, {
            include: [Tag]
        })
        if (!article) {
            throw new HttpException(400, "查找文章不存在", "article not found")
        }
        //根据文章拿到作者信息
        let author = await article.getUser()
        handleArticle(article, author)
        res.status(200).json({
            status: 1,
            message: "文章获取成功",
            data: article.dataValues
        })

    } catch (error) {
        next(error)
    }
}


//更新文章
module.exports.updateArticles = async (req, res, next) => {
    try {
        let { slug } = req.params
        //获取更新内容
        let { title, description, body } = req.body.article
        //获取文章
        let article = await Article.findByPk(slug, { include: [Tag] })
        if (!article) {
            throw new HttpException(400, "修改文章不存在", "article update not found")
        }
        //验证修改文章的权限，必须是登陆用户,并且是当前作者
        let loginUser = await User.findByPk(req.user.email)
        if (!loginUser) {
            throw new HttpException(400, "用户不存在", "author not found")
        }
        //当前文章对应的作者
        let authorEmail = article.dataValues.userEmail
        if (authorEmail !== loginUser.dataValues.email) {
            throw new HttpException(403, "用户没有权限修改该资源", "user not have authorization")
        }
        //修改字段准备
        title = title ? title : article.dataValues.title
        description = description ? description : article.dataValues.description
        body = body ? body : article.dataValues.body
        let updateResult = await article.update({ title, description, body })
        handleArticle(article, loginUser)
        //返回数据
        res.status(200).json({
            status: 1,
            message: "文章修改成功",
            data: updateResult.dataValues
        })
    } catch (error) {
        next(error)
    }
}


//删除文章
module.exports.deleteArticles = async (req, res, next) => {
    try {
        let { slug } = req.params
        //获取文章，文章不存在需要抛出异常
        let article = await Article.findByPk(slug, { include: [Tag] })
        if (!article) {
            throw new HttpException(400, "删除文章不存在", "article delete not found")
        }
        //获取当前的用户信息
        let loginUser = await User.findByPk(req.user.email)
        //比对文章作者和当前用户，查看是否由权限
        let authorEmail = article.dataValues.userEmail
        if (authorEmail !== loginUser.dataValues.email) {
            throw new HttpException(403, "用户没有权限删除该资源", "user not have authorization")
        }
        let deleteResult = await Article.destroy({ where: { slug } })
        res.status(200).json({
            status: 1,
            message: "文章删除成功"
        })
    } catch (error) {
        next(error)
    }
}


//获取文章:关注的作者的文章
module.exports.getFollowArticle = async (req, res, next) => {
    try {
        //登陆用户，也就是粉丝的email
        let fansEmail = req.user.email
        let query = `SELECT userEmail FROM follow WHERE followerEmail="${fansEmail}"`
        let followAuthors = await sequelize.query(query)
        //获取登陆用户的关注的作者，如果没有关注也就没有文章
        if (followAuthors[0].length == 0) {
            return res.status(200).json({
                status: 1,
                message: "没有关注的作者，获取文章为空",
                data: []
            })
        }
        //获取作者email，遍历email获取文章 
        let followAuthorEmails = []
        for (let a of followAuthors[0]) {
            followAuthorEmails.push(a.userEmail)
        }
        //获取作者文章
        let articleAll = await Article.findAll({
            where: {
                userEmail: followAuthorEmails  //[email,email]
            },
            include: [Tag, User]
        })
        //处理返回的结果
        let articles = []
        for (let i of articleAll) {
            i.dataValues.tags = i.dataValues.tags.map(val => val.name)
            delete i.dataValues.user.password
            articles.push(i.dataValues)
        }

        res.json({
            status: 1,
            message: "文章获取成功",
            data: articles
        })
    } catch (error) {
        next(error)
    }
}


//获取文章:条件（tag，author，limit，offset）获取全局文章
//限制，偏移量
//标签-文章
//作者-文章
//作者-标签-文章
module.exports.getArticles = async (req, res, next) => {
    try {
        let { tag, author, limit = 10, offset = 0 } = req.query
        
        //获取文章数组
        let articleAll = []
        if (tag && !author) {
            //有标签没作者
            articleAll = await Article.findAll({
                include: [{
                    model: Tag,
                    attributes: ["name"],
                    where: { name: tag }
                }, {
                    model: User,
                    attributes: ["email", "username", "bio", "avatar"]
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })

        } else if (!tag && author) {
            //有作者没标签
            articleAll = await Article.findAll({
                include: [{
                    model: Tag,
                    attributes: ["name"]
                }, {
                    model: User,
                    attributes: ["email", "username", "bio", "avatar"],
                    where: { username: author }
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
        } else if (tag && author) {
            //有作者有标签
            articleAll = await Article.findAll({
                include: [{
                    model: Tag,
                    attributes: ["name"],
                    where: { name: tag }
                }, {
                    model: User,
                    attributes: ["email", "username", "bio", "avatar"],
                    where: { username: author }
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
        } else {  //没有匹配的情况
            throw new HttpException(400, "必须选择用户或者标签", "chose tag or author")
        }

        //文章数据处理
        let arrResult = []
        for (let i of articleAll) {
            i.dataValues.tags = i.dataValues.tags.map(val => val.name)
            arrResult.push(i.dataValues)
        }
        //返回数据
        res.status(200).json({
            status: 1,
            message: "文章查询获取成功",
            data: arrResult
        })
    } catch (error) {
        next(error)
    }
}