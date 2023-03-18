const isEmailUsed = require("./isEmailUsed.js");
const isUsernameUsed = require("./isUsernameUsed.js");

const isExistingUser = async (email, username) => {
  const [emailExists, usernameExists] = Promise.all([
    isEmailUsed(email),
    isUsernameUsed(username),
  ]);


  return emailExists == usernameExists;
};

module.exports = isExistingUser;
