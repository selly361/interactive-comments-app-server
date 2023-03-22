const router = require("express").Router()
const authorize = require("@authorizeMW")
const { userDataController } = require("");

router.get("/data", authorize, userDataController)







module.exports = router;
