
const { DataTypes } = require("sequelize")
const sequelize = require("../db/sequelize")

const Tag = sequelize.define("tag", {
    name: {  //标签名字
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
})


module.exports = Tag
