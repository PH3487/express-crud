const { Router } = require("express");
const { param, body } = require("express-validator");
const booksController = require("./../controller/booksController");
const middleware = require("./../middlewares/auth");
const router = Router();

router.get("/", booksController.get);
router.get("/:id", booksController.get);
router.post(
  "/",
  middleware.auth,
  body("bookName").notEmpty().withMessage("bookName is Required"),
  body("bookDescription").notEmpty().withMessage("bookDescription is Required"),
  body("bookPrice")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("bookPrice is Required"),
  booksController.create
);

router.put(
  "/",
  middleware.auth,
  body("bookId").notEmpty().withMessage("bookId is Required"),
  body("bookName").notEmpty().withMessage("bookName is Required"),
  body("bookDescription").notEmpty().withMessage("bookDescription is Required"),
  body("bookPrice")
    .isNumeric({ no_symbols: true })
    .notEmpty()
    .withMessage("bookPrice is Required"),
  booksController.update
);
router.delete("/", middleware.auth, booksController.delete);

module.exports = router;
