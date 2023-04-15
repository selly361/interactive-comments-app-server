const isEmailValid = require('@isEmailValid')
const isPasswordValid = require('@isPasswordValid')
const isUsernameValid = require('@isUsernameValid')

const MISSING_CREDENTIALS = { error: 'Missing credentials', code: 'MISSING_CREDENTIALS' }
const INVALID_CREDENTIALS = { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }

function validateRegistration(req, res, next) {
    const { email, username, password } = req.body
 
    if (![email, username, password].every(Boolean)) {
       return res.status(400).json(MISSING_CREDENTIALS)
    }
 
    if (!isEmailValid(email) || !isUsernameValid(username) || !isPasswordValid(password)) {
       return res.status(400).json(INVALID_CREDENTIALS)
    }
 
    next()
 }

function validateLogin(req, res, next) {
   const { emailOrUsername, password } = req.body

   if (![emailOrUsername, password].every(Boolean)) {
      return res.status(400).json(MISSING_CREDENTIALS)
   }

   if (!isEmailValid(emailOrUsername) || !isUsernameValid(emailOrUsername) || !isPasswordValid(password)) {
      return res.status(400).json(INVALID_CREDENTIALS)
   }

   next()
}

module.exports = { validateLogin, validateRegistration }
