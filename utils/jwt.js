const jwt = require("jsonwebtoken");
const pk = process.env.JWT_PRIVATE_KEY;
module.exports = {
  /**
   *
   * @param {string|object|Buffer} payload
   * @returns {string}
   */
  async sign(payload) {
    return await jwt.sign(payload, pk, {
      expiresIn: "1d",
    });
  },
  /**
   *
   * @param {string} token: string
   * @returns {*} { uid: string, username: string, iat: number, exp: number }
   */
  async verify(token) {
    const decoded = await jwt.verify(token, pk);
    if (!decoded || decoded.exp < Date.now() / 1000) {
      return false;
    }
    return decoded;
  },
};
