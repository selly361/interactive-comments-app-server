const router = require("express").Router();
const authorize = require("@authorizeMW");
const { userDataController } = require("@userControllers");

router.get("/data", authorize, userDataController);

module.exports = router;
