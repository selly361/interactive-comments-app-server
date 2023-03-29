const router = require('express').Router()
const validateInfo = require('@validateMW')
const controllers = require('@authControllers')
const limiters = require('@rateLimitConfigs')

router.post('/register', [validateInfo, limiters.createAccountLimiter], controllers.registerController)

router.post('/login', [limiters.loginLimiter], controllers.loginController)

router.post('/logout', controllers.logoutController)

router.get('/refresh-token', [limiters.refreshTokenLimiter], controllers.refreshTokenController)

router.post('/verify-auth', [limiters.verifyAuthLimiter], controllers.verifyAuth)

module.exports = router
