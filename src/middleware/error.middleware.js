

const errorMiddleware = (error, req, res, next) => {
    //error是HttpExceptions的实例
    let status = error.status || 500
    let message = error.message || "服务器端错误"
    let errors = error.errors || "server is wrong"
    res.status(status).json({
        code: 0,
        message: message,
        errors: errors
    })
}

module.exports = errorMiddleware