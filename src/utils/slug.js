
const uniqueSlug = require("unique-slug")

module.exports.getSlug = () => {
    let randomSlug = uniqueSlug()
    return randomSlug
}