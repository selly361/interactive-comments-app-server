const router = require("express").Router();
const validateInfo = require("@validateMW");
const controllers = require("@authControllers");

router.post("/register", validateInfo, controllers.registerController);

router.post("/login", validateInfo, controllers.loginController);

router.get("/refresh-token", controllers.refreshTokenController);

module.exports = router;
