const express = require("express")
const router = express.Router()

const FollowController = require("../controller/follow")
const { authMiddleware } = require("../middleware/admin/auth.middleware")


//传过来的是需要关注的对方
router.post("/:username", authMiddleware, FollowController.follow)

//关注对方
router.delete("/:username", authMiddleware, FollowController.cancelFollow)

//获取关注自己的粉丝
router.get("/:username", authMiddleware, FollowController.getFollowers)


module.exports = router