const isEmailValid = require("@utils/isEmailValid.js");
const isPasswordValid = require("@utils/isPasswordValid.js");
const isUsernameValid = require("@utils/isUsernameValid.js");

module.exports = function (req, res, next) {
  const { email, username, password } = req.body;

  if (![email, username, password].every(Boolean)) {
    return res
      .status(400)
      .json({ error: "Missing credentials", code: "MISSING_CREDENTIALS" });
  }

    if (!isEmailValid(email)) {
      return res
        .status(400)
        .json({ error: "Invalid email", code: "INVALID_EMAIL" });
    }

    if (!isUsernameValid(username)) {
      return res
        .status(400)
        .json({ error: "Invalid username", code: "INVALID_USERNAME" });
    }

    if (!isPasswordValid(password)) {
      return res
        .status(400)
        .json({ error: "Invalid password", code: "INVALID_PASSWORD" });
    }

    next()
};
