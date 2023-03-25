const isEmailValid = require('@isEmailValid')
const isPasswordValid = require('@isPasswordValid')
const isUsernameValid = require('@isUsernameValid')

module.exports = function (req, res, next) {
   const { email, username, password } = req.body

   if (![email, username, password].every(Boolean)) {
      return res.status(400).json({ error: 'Missing credentials', code: 'MISSING_CREDENTIALS' })
   }

   if (!isEmailValid(email) || !isUsernameValid(username) || !isPasswordValid(password)) {
      return res.status(400).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })
   }

   next()
}
