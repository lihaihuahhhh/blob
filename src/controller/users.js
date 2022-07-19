const HttpException = require("../exceptions/http.exception")
const User = require("../models/user")
const { validateCreateUser, validateUserLogin } = require("../utils/validate/user.validate")
const { matchPassword, md5Passwword } = require("../utils/md5")
const { sign, verify } = require("../utils/jwt")


//用户登录
module.exports.login = async (req, res, next) => {
    try {
        let { username, email, password } = req.body.user
        //验证数据是否正确
        let { error, validateResult } = validateUserLogin(email, password)
        if (!validateResult) {
            throw new HttpException(400, "数据格式有问题", error)
        }

        //验证业务逻辑
        let user = await User.findByPk(email)
        if (!user) {
            throw new HttpException(401, "用户不存在", "user not found")
        }
        //密码是否匹配
        let oldMd5Pwd = user.dataValues.password
        let match = await matchPassword(oldMd5Pwd, password)
        if (!match) {
            throw new HttpException(401, "用户密码错误", "password not match")
        }

        //生成token
        let token = await sign(req.body.user)
        //返回数据
        res.status(200).json({
            status: 1,
            msg: "登陆成功",
            token
        })
    } catch (error) {
        next(error)
    }
}


//用户注册
module.exports.createUser = async (req, res, next) => {
    try {
        //获取客户端请求的内容
        let { username, password, email } = req.body.user
        //数据验证
        let { error, validateResult } = validateCreateUser(username, password, email)
        if (!validateResult) {
            throw new HttpException(400, "数据格式有问题", error)
        }
        //业务验证,两步，1是验证email是否存在，2是密码加密 3是存储到数据库
        //创建成功后就返回.创建token和返回数据
        let user = await User.findByPk(email)
        if (user) {
            throw new HttpException(400, "用户邮箱已经注册", "email has regitered")
        }
        //密码加密，存储到数据库
        password = await md5Passwword(password)
        user = User.create({ username, password, email })
        res.status(200).json({
            status: 200,
            message: "注册成功"
        })
    } catch (error) {
        next(error)
    }
}

//获取用户
module.exports.getUser = async (req, res, next) => {
    try {
        const { email } = req.user
        //验证请求时携带的token是不是正确
        const user = await User.findByPk(email)
        if (!user) {
            throw new HttpException(401, "用户不存在", "user not found")
        }
        //去除password字段
        delete user.dataValues.password
        //添加token字段
        user.dataValues.token = req.user.token
        res.status(200).json({
            status: 1,
            message: "获取用户信息成功",
            dataValues: user.dataValues
        })
    } catch (error) {
        next(error)  //如果有错误就给后面的进行拦截
    }
}

//用户信息修改
module.exports.updateUser = async (req, res, next) => {
    try {
        //获取数据
        let { email } = req.user
        //验证请求数据,email用户是否存在
        let user = await User.findByPk(email)
        if (!user) {
            throw HttpException(401, "用户不存在", "user not found")
        }
        //修改用户数据
        let bodyUser = req.body.user
        if (bodyUser) {
            //数据字段判断是否存在(因为字段不确定在不在)
            let username = bodyUser.username ? bodyUser.username : user.username
            let bio = bodyUser.bio ? bodyUser.bio : user.bio
            let avatar = bodyUser.avatar ? bodyUser.avatar : user.avatar
            //密码单独处理
            let password = user.password
            if (bodyUser.password) {
                password = await md5Passwword(bodyUser.password)
            }
            let updateUser = await user.update({ username, bio, password, avatar })
            //去除返回信息中的密码
            delete updateUser.dataValues.password
            //这里必须重新生成，因为用户名这些的有可能变化
            updateUser.dataValues.token = await sign({ username, email })
            res.status(200).json({
                status: 1,
                message: "用户信息修改成功",
                dataValues: user.dataValues
            })
        } else {
            throw HttpException(400, "更新数据不能为空", "update data not allow null")
        }
        //

    } catch (error) {
        next(error)
    }
}