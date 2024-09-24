const jwt = require("./../utils/jwt");

module.exports = {
  auth: async (req, res, next) => {
    if (!req.headers["authorization"]) {
      return res.status(401).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const [type, token] = req.headers["authorization"].split(" ");

    if (!type || type != "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const verifyToken = await jwt.verify(token);
    if (!verifyToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorization",
      });
    }
    req.user = verifyToken;
    next();
  },
};
