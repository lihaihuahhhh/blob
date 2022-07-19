const express = require("express")


const userRoute = require("../routes/users")
const followRoute = require("../routes/follow")
const tagRoute = require("../routes/tag")
const articleRoute = require("../routes/articles")
const favoriteRoute = require("../routes/favorite")
const commentRoute = require("../routes/comment")

const initRoute = (app) => {
    app.use("/api/v1/users", userRoute)
    app.use("/api/v1/follow", followRoute)
    app.use("/api/v1/tag", tagRoute)
    app.use("/api/v1/article", articleRoute)
    app.use("/api/v1/favorite", favoriteRoute)
    app.use("/api/v1/comment", commentRoute)
}

module.exports = initRoute