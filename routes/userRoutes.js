const router = require("express").Router()
const authorize = require("@authorizeMW")
const db = require("@db")

router.get("/user", authorize, (req, res) => {
    const userId = req;

    let query = `
    SELECT * FROM users
    WHERE user_id = $1
    `

    const user = db.query(query, [userId])

    console.log(user)
})







module.exports = router;