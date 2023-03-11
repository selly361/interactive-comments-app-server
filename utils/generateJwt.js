const jwt = require("jsonwebtoken");

/**
 * Generate a JSON Web Token for the given user ID
 *
 * @param {Number} id - The user ID to include in the JWT payload
 *
 * @returns {String} The access token
 */
const generateAccessToken = (id) => {
  const payload = { user_id: id };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return token;
};

/**
 * Generate a refresh token for the given user ID
 *
 * @param {Number} id The user ID to include in the refresh token payload
 * @returns {String} The refresh token
 */
const generateRefreshToken = (id) => {
  const payload = { user_id: id };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
