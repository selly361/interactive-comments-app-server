const db = require("@db");
const isExistingUser = require("@utils/isExistingUser");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("@utils/generateJwt.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { email, username, password } = req.body;

  if (await isExistingUser(username, email)) {
    return res
      .status(409)
      .json({ error: "User Exists", code: "EXISTING_USER" });
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  let query = `
        INSERT INTO "user" (email, username, password)
        
        VALUES ($1, $2, $3)
        
        RETURNING *;
    `;

  try {
    const { rows } = await db.query(query, [email, username, hashedPassword]);

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

  if (!(await isExistingUser(username, email))) {
    return res
      .status(409)
      .json({ error: "User Doesn't Exist", code: "INVALID_USER" });
  }

  let query = `
        SELECT * FROM "user"
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
    maxAge: 7 * 24 * 60 * 60 * 1000
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


    const access_token = generateAccessToken(user_id)

    res.status(200).json({ access_token })
    
  } catch (error) {
    return res.status(401).json({
      error: "Token is not valid",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = { registerController, loginController, refreshTokenController };
