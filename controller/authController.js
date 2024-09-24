const { validationResult } = require("express-validator");
const { db } = require("./../utils/db");
const { sign } = require("./../utils/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  async login(req, res) {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: v.array()[0].msg });
    }

    const { username, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password is invalid" });
    }

    const token = await sign({ uid: user.uid, username });
    return res.status(200).json({
      success: true,
      message: "Logged in successful",
      data: {
        uid: user.uid,
        token,
      },
    });
  },

  async register(req, res) {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: v.array()[0].msg });
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    if (result.affectedRows) {
      const token = await sign({ uid: result.insertId, username });
      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          uid: result.insertId,
          token,
        },
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Could not register user" });
    }
  },

  async me(req, res) {
    try {
      const [users] = await db.query(
        "SELECT uid, username FROM users WHERE uid = ?",
        [req.user.uid]
      );
      const user = users[0];

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        data: user,
        user: {
          uid: user.uid,
          username: user.username,
        },
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  },
};
