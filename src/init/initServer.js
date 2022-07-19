
const initServer = async (app) => {

    let PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
        console.log("server is running at port " + PORT);
    })
}

module.exports = initServer