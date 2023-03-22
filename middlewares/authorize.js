const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = {
      error: "Authorization denied",
      code: "AUTHORIZATION_DENIED",
    };
    return res.status(403).json(error);
  }

  const token = authHeader.substring(7);
  
  try {
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { user_id } = verify;
    req.user_id = user_id;
    next();
  } catch (err) {
    console.error(err);
    const error = {
      error: "Token is not valid",
      code: "INVALID_TOKEN",
    };
    return res.status(401).json(error);
  }
};
