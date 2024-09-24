const jwt = require("jsonwebtoken");
const pk = process.env.JWT_PRIVATE_KEY;
module.exports = {
  async sign(payload) {
    return await jwt.sign(payload, pk, {
      expiresIn: "1d",
    });
  },
  async verify(token) {
    const decoded = await jwt.verify(token, pk);
    if (!decoded || decoded.exp < Date.now() / 1000) {
      return false;
    }
    return decoded;
  },
};
