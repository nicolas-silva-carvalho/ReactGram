const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check if header has a token
  if (!token) {
    return res.status(401).json({ errors: ["Access denied!"] });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);

    // This is the only line that changes.
    // Replace the Mongoose findById with our PostgreSQL-compatible function.
    req.user = await User.findById(verified.id);

    next();
  } catch (error) {
    res.status(401).json({ errors: ["Invalid token."] });
  }
};

module.exports = authGuard;
