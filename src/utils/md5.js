//md5加密，加个盐

const md5 = require("md5")
const SALT = "lhh"

const md5Passwword = (password) => {
    return new Promise((resolve, reject) => {
        const md5PWD = md5(password + SALT)
        resolve(md5PWD)
    })
}

const matchPassword = (oldMd5Pwd, password) => {
    return new Promise((resolve, reject) => {
        const newMD5PWD = md5(password + SALT)
        if (oldMd5Pwd === newMD5PWD) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

module.exports.md5Passwword = md5Passwword
module.exports.matchPassword = matchPassword

// async function test() {
//     const password = "1234"
//     md5Passwword(password).then((res) => {
//         console.log(res);
//         matchPassword(res, "12").then((res) => {
//             console.log(res)
//         }).catch(err => {
//             console.log(err)
//         })
//     })
// }
// test()