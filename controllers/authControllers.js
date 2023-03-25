const db = require("@db");
const jdenticon = require("jdenticon");
const isExistingUser = require("@isExistingUser");
const isUsernameUsed = require("@isUsernameUsed");
const isEmailUsed = require("@isEmailUsed");
const sendError = require("@sendError");

const { generateAccessToken, generateRefreshToken } = require("@generateJwt");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  let { email, username, password } = req.body;
  
  email = email.toLowerCase()
  username = username.toLowerCase()
  

  const [userExists, usernamesUsed, emailsUsed] = await Promise.all([
    isExistingUser(email, username),
    isUsernameUsed(username),
    isEmailUsed(email),
  ]);

  if (userExists) return sendError(res, 409, "User Exists", "EXISTING_USER");

  if (usernamesUsed) return sendError(res, 409, "Username is taken", "USERNAME_TAKEN");

  if (emailsUsed) return sendError(res, 409, "Email is taken", "EMAIL_TAKEN");

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  let query = `
        INSERT INTO users (email, username, profile_image, password)
        
        VALUES ($1, $2, $3, $4)
        
        RETURNING *;
    `;

  const profileImage = jdenticon.toSvg(username + email, 100);

  try {
    const { rows } = await db.query(query, [
      email,
      username,
      profileImage,
      hashedPassword,
    ]);

    if (rows.length === 0) {
      throw new Error("User creation failed");
    }

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    sendError(res, 500, "User creation failed", "SERVER_ERROR");
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  let query = `
  
  SELECT * FROM users

  WHERE email = $1;

`;

  const { rows } = await db.query(query, [email.toLowerCase()])

  if (!rows.length > 0){
    return sendError(res, 409, "User Doesn't Exist", "INVALID_USER");
}

  const { password: hashedPassword, user_id } = rows[0];

  if (!bcrypt.compare(password, hashedPassword)){
    return sendError(res, 409, "Incorrect password", "INCORRECT_PASSWORD");
}
  
  const access_token = generateAccessToken(user_id);
  const refresh_token = generateRefreshToken(user_id);

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ access_token });
};

const refreshTokenController = (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token){
    return sendError(
      res,
      401,
      "Refresh token not found in request",
      "MISSING_REFRESH_TOKEN"
    );
}
  try {
    const { user_id } = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const access_token = generateAccessToken(user_id);

    res.status(200).json({ access_token });
  } catch (error) {
    sendError(res, 401, "Token is not valid", "INVALID_TOKEN");
  }
};



const verifyAuth = async (req, res) => {
  const { access_token } = req.body;

  try {
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);


    
    res.status(200).json({ status: "AUTHENTICATED" });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired", "TOKEN_EXPIRED");
    }

    sendError(res, 401, "Invalid token", "INVALID_TOKEN");
  }
};


module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  verifyAuth
};
