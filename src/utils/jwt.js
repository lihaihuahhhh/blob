
require("dotenv").config({ path: '../../.env' })
const jwt = require("jsonwebtoken")


//加签名=>token

const sign = async (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(user, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                return reject(err)
            }
            resolve(token)
        })
    })
}

//解签=>验证

const verify = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err)
            }
            resolve(decoded)
        })
    })
}

module.exports = { sign, verify }

// //test
// let test = async () => {
//     let data = {
//         username: "admin",
//         email: "admin@qq.com"
//     }
//     let token = await sign(data)
//     console.log(token);
// }
// test()