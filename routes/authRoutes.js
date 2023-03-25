const router = require('express').Router()
const validateInfo = require('@validateMW')
const controllers = require('@authControllers')
const {
   createAccountLimiter,
   loginLimiter,
   refreshTokenLimiter,
   verifyAuthLimiter,
} = require('@rateLimitConfigs')

router.post('/register', [validateInfo, createAccountLimiter], controllers.registerController)

router.post('/login', [loginLimiter], controllers.loginController)

router.post('/logout', controllers.logoutController)

router.get('/refresh-token', [refreshTokenLimiter], controllers.refreshTokenController)

router.post('/verify-auth', [verifyAuthLimiter], controllers.verifyAuth)

module.exports = router
