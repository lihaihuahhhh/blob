const connection = require("../db/connection.js")
const sequelize = require("../db/sequelize")

const User = require("../models/user")
const Comment = require("../models/comment")
const Tag = require("../models/tag")
const Article = require("../models/article")

const initDb = () => {
    return new Promise(async (resolve, reject) => {
        try {
            //数据库连接
            await connection()
            //初始化model关系
            initRelation()
            //模型同步,就是将所有的模型和关系同步到数据库中
            await sequelize.sync({ alter: true })  //里面的配置是字段更新
            resolve()
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}

//模型关系
//a.hasOne(b)  //a有一个b
//a.belongsto(b)  //a属于b

function initRelation() {
    //用户和文章是一对多的关系
    User.hasMany(Article, {
        onDelete: "CASCADE"
    })
    Article.belongsTo(User)   //这里会在article模型上面添加有个useremail字段,文章属于那个用户
    //文章和标签的关系,多对多
    Article.belongsToMany(Tag, {  //更具这个多对多的关系再新建一个表
        through: "TagList",
        uniqueKey: false,
        timestamps: false
    })
    Tag.belongsToMany(Article, {  //更具这个多对多的关系再新建一个表
        through: "TagList",
        uniqueKey: false,
        timestamps: false
    })
    //用户和评论是一对多的关系
    User.hasMany(Comment, {
        onDelete: "CASCADE"
    })
    Comment.belongsTo(User)

    //文章和评论的关系是一对多
    Article.hasMany(Comment, {
        onDelete: "CASCADE"
    })
    Comment.belongsTo(Article)


    //用户和文章是多对多的关系（喜欢）
    User.belongsToMany(Article, {
        through: "favorite",
        timestamps: false
    })
    Article.belongsToMany(User, {
        through: "favorite",
        timestamps: false
    })

    //用户和用户之间的关系,自连接
    User.belongsToMany(User, {
        through: "follow",
        as: "followers",
        timestamps: false
    })
}

module.exports = initDb