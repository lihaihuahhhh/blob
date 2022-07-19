
const validator = require("validator")

//数据校验一般有三个部分，一个是前端自己的校验，还有一个utils的校验，还有和数据库交互时候的校验

//用户注册
module.exports.validateCreateUser = (username, password, email) => {
    let error = {}

    if (validator.isEmpty(username)) {
        error.username = "用户名不能为空"
    }
    if (validator.isEmpty(password)) {
        error.username = "密码不能为空"
    }
    if (validator.isEmpty(email)) {
        error.username = "邮箱不能为空"
    }
    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
        error.email = "邮箱格式有问题"
    }

    let validateResult = Object.keys(error).length < 1  //true就是没错，验证通过
    return { error, validateResult }
}

//用户登陆
module.exports.validateUserLogin = (email, password) => {
    let error = {}

    if (validator.isEmpty(password)) {
        error.username = "密码不能为空"
    }
    if (validator.isEmpty(email)) {
        error.username = "邮箱不能为空"
    }
    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
        error.email = "邮箱格式有问题"
    }

    let validateResult = Object.keys(error).length < 1  //true就是没错，验证通过
    return { error, validateResult }
}
