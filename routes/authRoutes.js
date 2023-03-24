const router = require("express").Router();
const validateInfo = require("@validateMW");
const controllers = require("@authControllers");
const { createAccountLimiter, loginLimiter, refreshTokenLimiter, verifyAuthLimiter } = require("@rateLimitConfigs");

router.post("/register", [validateInfo, createAccountLimiter], controllers.registerController);

router.post("/login", [validateInfo, loginLimiter], controllers.loginController);

router.get("/refresh-token", [refreshTokenLimiter], controllers.refreshTokenController);

router.post("/verify-auth", [verifyAuthLimiter], controllers.verifyAuth)

module.exports = router;
