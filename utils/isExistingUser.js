const isEmailUsed = require('@isEmailUsed')
const isUsernameUsed = require('@isUsernameUsed')

const isExistingUser = async (email, username) => {
   const [emailExists, usernameExists] = await Promise.all([
      isEmailUsed(email),
      isUsernameUsed(username),
   ])

   if (emailExists && usernameExists) {
      return true
   } else return false
}

module.exports = isExistingUser
