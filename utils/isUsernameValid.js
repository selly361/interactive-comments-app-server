/**
 * Checks whether a given username string is valid.
 *
 * @param {string} username - The username to validate.
 * @returns {boolean} Returns true if the username is valid, false otherwise.
 *
 */
const isUsernameValid = (username) => {
    /**
     * Regular expression that matches a valid username pattern.
     *
     * @type {RegExp}
     */
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
  
    return usernamePattern.test(username);
  };
  
  
module.exports = isUsernameValid;