/**
 * Checks if a password is valid.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function isPasswordValid(password) {



    /**
     *  Regular expression that matches a valid username pattern.
     * 
     * @type {RegExp}
     * 
     */
    
    const passwordRegex = /^[a-zA-Z0-9]{5,20}$/;
    
    return passwordRegex.test(password);

  }
  

module.exports = isPasswordValid;