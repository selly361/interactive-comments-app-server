const rateLimit = require('express-rate-limit')

const createAccountLimiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 1 hour
   max: 5,
   message: 'Too many accounts created from this IP, please try again after an hour',
   standardHeaders: true,
   legacyHeaders: false,
})

const loginLimiter = rateLimit({
   windowMs: 5 * 60 * 1000, // 5 minutes
   max: 5,
   message: 'Too many login attempts, please try again later',
   standardHeaders: true,
   legacyHeaders: false,
})

const refreshTokenLimiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 1 hour
   max: 5,
   message: 'Too many refresh token requests, please try again after an hour',
   standardHeaders: true,
   legacyHeaders: false,
})

const verifyAuthLimiter = rateLimit({
   windowMs: 5 * 60 * 1000, // 5 minutes
   max: 10,
   message: 'Too many requests, please try again later',
   standardHeaders: true,
   legacyHeaders: false,
})

const forgotPasswordLimiter = rateLimit({
   windowMs: 5 * 60 * 1000, // 5 minutes
   max: 5,
   message: 'Too many forgot password requests, please try again later',
   headers: true,
 });
 
 const resetPasswordLimiter = rateLimit({
   windowMs: 5 * 60 * 1000, // 5 minutes
   max: 5,
   message: 'Too many reset password requests, please try again later',
   headers: true,
 });


module.exports = {
   createAccountLimiter,
   loginLimiter,
   refreshTokenLimiter,
   verifyAuthLimiter,
}
