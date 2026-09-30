const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protectRoute = async (req, res, next) => {
  try {
    // the frontend sends the JWT in a custom "token" header
    const auth = req.headers.authorization;
    const token = req.headers.token || (auth?.startsWith("Bearer ") ? auth.slice(7) : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_PASS);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    // invalid / expired token: answer instead of leaving the request hanging
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired, please log in again" });
    }
    next(error);
  }
};
