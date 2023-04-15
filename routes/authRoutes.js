const router = require('express').Router()
const validate = require('@validationMW')
const controllers = require('@authControllers')
const limiters = require('@rateLimitConfigs')

router.post('/register', [validate.validateRegistration, limiters.createAccountLimiter], controllers.registerController)

router.post('/login', [validate.validateLogin, limiters.loginLimiter], controllers.loginController)

router.post('/logout', controllers.logoutController)

router.get('/refresh-token', [limiters.refreshTokenLimiter], controllers.refreshTokenController)

module.exports = router
