
const validator = require("validator")

//数据校验一般有三个部分，一个是前端自己的校验，还有一个utils的校验，还有和数据库交互时候的校验

//用户注册
module.exports.validateCreateArticle = (title, description, body, tags) => {
    let error = {}

    if (validator.isEmpty(title)) {
        error.username = "文章标题不能为空"
    }
    if (validator.isEmpty(description)) {
        error.username = "文章描述不能为空"
    }
    if (validator.isEmpty(body)) {
        error.username = "文章内容不能为空"
    }
    if (!Array.isArray(tags)) {
        error.tags = "文章的标签应该是一个数组类型"
    }

    let validateResult = Object.keys(error).length < 1  //true就是没错，验证通过
    return { error, validateResult }
}


