const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: 0,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "phonex_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: 0,
      message: "Invalid or expired token.",
    });
  }
};

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: 0,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "phonex_secret_key");
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: 0,
        message: "Access denied. Admin role required.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: 0,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
