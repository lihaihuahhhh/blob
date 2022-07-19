const HttpException = require("../exceptions/http.exception")
const User = require("../models/user")

//关注,注意这里是登陆者关注了传过来的人
module.exports.follow = async (req, res, next) => {
    try {
        let username = req.params.username

        let userA = await User.findOne({
            where: {
                username
            }
        })
        if (!userA) {
            throw new HttpException(404, "被关注的用户不存在", "user with this username not found")
        }
        let { email } = req.user
        //获取用户的信息
        let userB = await User.findByPk(email)
        //添加关注,被关注者和关注者主键存储到数据库表中followers
        await userA.addFollowers(userB)
        //返回被关注着信息，基本信息和关注状态
        let profile = {
            username: userA.dataValues.username,
            bio: userA.dataValues.bio,
            avatar: userA.dataValues.avatar,
            following: true
        }
        res.status(200).json({
            status: 1,
            message: "关注成功",
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

//取消关注
module.exports.cancelFollow = async (req, res, next) => {
    try {
        let username = req.params.username

        let userA = await User.findOne({
            where: {
                username
            }
        })
        if (!userA) {
            throw new HttpException(404, "被关注的用户不存在", "user with this username not found")
        }
        let { email } = req.user
        //获取用户的信息
        let userB = await User.findByPk(email)
        //添加关注,被关注者和关注者主键存储到数据库表中followers
        await userA.removeFollowers(userB)
        //返回被关注者的信息，基本信息和关注状态
        let profile = {
            username: userA.dataValues.username,
            bio: userA.dataValues.bio,
            avatar: userA.dataValues.avatar,
            following: false
        }
        res.status(200).json({
            status: 1,
            message: "取消关注成功",
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

//获取粉丝数，登陆者是否关注了对方
module.exports.getFollowers = async (req, res, next) => {
    try {
        //提取用户名(这里的用户是被查看的那个人)以及校验
        let username = req.params.username
        //这里连表查询,获取所有的粉丝
        let userA = await User.findOne({
            where: {
                username
            },
            include: ["followers"]
        })
        if (!userA) {
            throw new HttpException(404, "被关注的用户不存在", "user with this username not found")
        }
        //验证是否关注，当前登陆粉丝 email，通过token
        //是否关注，当前登陆的用户email 是否在作者所有粉丝的email里面
        let { email } = req.user
        let following = false
        let followers = []
        for (let user of userA.dataValues.followers) {
            delete user.dataValues.password
            delete user.dataValues.follow
            followers.push(user.dataValues)
            if (user.dataValues.email === email) {
                following = true
            }
        }
        let profile = {
            username: userA.dataValues.username,
            bio: userA.dataValues.bio,
            avatar: userA.dataValues.avatar,
            following,
            followers
        }
        res.status(200).json({
            status: 1,
            message: "获取关注信息成功",
            data: profile
        })

    } catch (error) {
        next(error)
    }
}