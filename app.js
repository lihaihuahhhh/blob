//环境配置文件引入
require("dotenv").config({ path: '.env' })

const express = require("express")
const app = express()

//外部中间件的引入
const cors = require("cors")
const morgan = require("morgan")

//自定义中间件引入
const noMatchMiddleware = require("./src/middleware/404.middleware")
const errorMiddleware = require("./src/middleware/error.middleware")

//初始化
const initDb = require("./src/init/initDb")
const initServer = require("./src/init/initServer")
const initRoute = require("./src/init/initRoute")

//应用级中间件
app.use(cors({ credentials: true, origin: true })) //跨域
app.use(express.json())  //解析json格式请求
app.use(express.urlencoded({ extended: false }))  //url-encoded数据
app.use(morgan("tiny"))   //http请求日志

//静态服务
app.use("/static", express.static("public"))
//初始化路由连接
initRoute(app)
//404
app.use(noMatchMiddleware)

//统一错误处理
app.use(errorMiddleware)


const main = async () => {
    //初始化数据库
    await initDb()
    //启动服务
    await initServer(app)
}
main()