const HttpException = require("../../exceptions/http.exception")
const { verify } = require("../../utils/jwt")

module.exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return next(new HttpException(401, "没有授权", "authorization missing"))
    }
    //验证token的类型是不是有错误
    let tokenType = authHeader.split(" ")[0]
    if (tokenType !== "Token") {
        return next(new HttpException(401, "授权格式错误：Token content", "authorization wrong"))
    }
    //验证token的内容是不是有错误
    let tokenContent = authHeader.split(" ")[1]
    if (!tokenContent) {
        return next(new HttpException(401, "授权格式错误: Token content", "authorization wrong"))
    }
    //解签验证
    try {
        let user = await verify(tokenContent)  //解签后的user信息
        user.token = authHeader  //追加token
        if (!user) {
            return next(new HttpException(401, "token 内容不存在", "token decode error"))
        }
        req.user = user  //在req上面挂载，给后面的中间件使用
        next()
    } catch (error) {
        //token验证失败，失效或者过期
        return next(new HttpException(401, "token 验证失败", error.message))
    }
}