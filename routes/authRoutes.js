const router = require("express").Router();
const validateInfo = require("@middlewares/validateInfo.js");
const { registerController, loginController } = require("@authControllers")

router.post("/register", validateInfo,  registerController)


router.post("/login", validateInfo, loginController);



module.exports = router;