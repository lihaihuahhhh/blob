const HttpException = require("../exceptions/http.exception")
const Tag = require("../models/tag")

//获取所有的标签
module.exports.getTags = async (req, res, next) => {
    try {
        //模型获取所有的标签
        const tagsAll = await Tag.findAll()
        let tags = []
        for (let tag of tagsAll) {
            tags.push(tag.dataValues.name)
        }

        res.json({
            status: 1,
            message: "标签查询成功",
            data: tags
        })
    } catch (error) {
        next(error)
    }
}

//创建标签
module.exports.createTags = async (req, res, next) => {
    try {
        //获取标签
        let tag = req.body.tag

        //标签验证

        //标签存储
        let tagResult = await Tag.create({ name: tag })

        res.json({
            status: 1,
            message: "标签创建成功",
            data: tagResult.dataValues
        })

    } catch (error) {
        next(error)
    }
}