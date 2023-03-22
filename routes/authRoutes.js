const router = require("express").Router();
const validateInfo = require("@validateMW");
const controllers = require("@authControllers");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5, 
	message: 'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true,
	legacyHeaders: false, 
})

router.post("/register", [validateInfo, createAccountLimiter], controllers.registerController);

router.post("/login", validateInfo, controllers.loginController);

router.get("/refresh-token", controllers.refreshTokenController);

module.exports = router;
