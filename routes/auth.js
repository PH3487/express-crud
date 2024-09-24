const { Router } = require("express");
const { body } = require("express-validator");
const authController = require("./../controller/authController");
const authMiddleware = require("./../middlewares/auth");
const router = Router();

router.post(
  "/login",
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  authController.login
);

router.post(
  "/register",
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  authController.register
);
router.get("/me", authMiddleware.auth, authController.me);

module.exports = router;
