
const { DataTypes } = require("sequelize")
const sequelize = require("../db/sequelize")

const User = sequelize.define("user", {
    email: {  //邮箱
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {  //用户名
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: { //密码
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    bio: {  //简介
        type: DataTypes.TEXT,
        allowNull: true
    }
})


module.exports = User
