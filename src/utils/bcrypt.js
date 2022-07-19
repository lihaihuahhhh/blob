

const bcrypt = require("bcrypt")
const SALT = 151

const md5Passwword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT, (err, encrypted) => {
            if (err) {
                reject(err)
            } else {
                resolve(encrypted)
            }
        })
    })
}

const matchPassword = (oldMd5Pwd, password) => {
    return new Promise(async (resolve, reject) => {
        bcrypt.compare(password, oldMd5Pwd, (err, same) => {
            if (err) {
                reject(err)
            } else {
                resolve(same)
            }
        })
    })
}

module.exports.md5Passwword = md5Passwword
module.exports.matchPassword = matchPassword

// async function test() {
//     const password = "1234"
//     md5Passwword(password).then((res) => {
//         console.log(res);
//         matchPassword(res, "1234").then((res) => {
//             console.log(res)
//         }).catch(err => {
//             console.log(err)
//         })
//     })
// }
// test()