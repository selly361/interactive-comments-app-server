/**
 * Checks whether a given email string is valid
 *
 * @param {string} email - The email to validate.
 *
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */

const isEmailValid = (email) => {
   /**
    * Regular expression that matches a valid email pattern.
    *
    * @type {RegExp}
    */

   const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

   return emailPattern.test(email)
}

module.exports = isEmailValid
