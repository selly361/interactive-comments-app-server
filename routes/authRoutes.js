const router = require("express").Router();
const validateInfo = require("@middlewares/validateInfo.js");
const { registerController, loginController, refreshTokenController } = require("@authControllers")

router.post("/register", validateInfo,  registerController)


router.post("/login", validateInfo, loginController);


router.get("/refresh-token", refreshTokenController);

module.exports = router;