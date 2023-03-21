const isEmailUsed = require("./isEmailUsed.js");
const isUsernameUsed = require("./isUsernameUsed.js");

const isExistingUser = async (email, username) => {
  const [emailExists, usernameExists] = await Promise.all([
    isEmailUsed(email),
    isUsernameUsed(username),
  ]);

  if (emailExists && usernameExists) {
    return true;
  }
};

module.exports = isExistingUser;
