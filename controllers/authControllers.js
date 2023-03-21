const db =            require("@db");
const jdenticon =     require("jdenticon");
const isExistingUser = require("@isExistingUser");
const isUsernameUsed = require("@isUsernameUsed");
const isEmailUsed =    require("@isEmailUsed");

const { generateAccessToken, generateRefreshToken } = require("@generateJwt");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  
  const { email, username, password } = req.body;

  if (await isExistingUser(email, username)) {
    return res
      .status(409)
      .json({ error: "User Exists", code: "EXISTING_USER" });
  } else if (await isUsernameUsed(username)) {
    return res
      .status(409)
      .json({ error: "Username is already taken", code: "USERNAME_TAKEN" });
  } else if (await isEmailUsed(email)) {
    return res
      .status(409)
      .json({ error: "Email is already registered", code: "EMAIL_REGISTERED" });
  }

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
    console.error(err);
    res
      .status(500)
      .json({ error: "User creation failed", code: "SERVER_ERROR" });
  }
};

const loginController = async (req, res) => {
  const { email, username, password } = req.body;

  if (!(await isExistingUser(email, username))) {
    return res
      .status(409)
      .json({ error: "User Doesn't Exist", code: "INVALID_USER" });
  }

  let query = `
        SELECT * FROM users
        WHERE email = $1 AND username = $2;
    `;

  const { rows } = await db.query(query, [email, username]);

  const { password: hashedPassword, user_id } = rows[0];

  if (!bcrypt.compare(password, hashedPassword)) {
    res
      .status(409)
      .json({ error: "Incorrect password", code: "INCORRECT_PASSWORD" });
  }

  const access_token = generateAccessToken(user_id);
  const refresh_token = generateRefreshToken(user_id);

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ access_token, refresh_token });
};

const refreshTokenController = (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({
      error: "Refresh token not found in request",
      code: "MISSING_REFRESH_TOKEN",
    });
  }

  try {
    const { user_id } = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const access_token = generateAccessToken(user_id);

    res.status(200).json({ access_token });
  } catch (error) {
    return res.status(401).json({
      error: "Token is not valid",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
};
