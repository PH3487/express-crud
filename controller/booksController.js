const { validationResult } = require("express-validator");
const { db } = require("../utils/db");
const { firstError } = require("../utils/exceptError");

module.exports = {
  get: async (req, res) => {
    let sql = "";
    let exec = [];
    if (!req.params.id) {
      sql = "SELECT * FROM books";
    } else {
      sql = "SELECT * FROM books WHERE book_id = ?";
      exec.push(req.params.id);
    }
    const getBook = await db.query(sql, exec);

    return res.json({
      success: true,
      message: "Get lists book",
      data: getBook[0],
    });
  },
  create: async (req, res) => {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return firstError(res, v, 400);
    }
    const { bookName, bookDescription, bookPrice } = req.body;
    const [result] = await db.query(
      "INSERT INTO books (book_author,book_name,book_description,book_price) VALUES (?,?,?,?)",
      [req.user.uid, bookName, bookDescription, bookPrice]
    );

    if (result.affectedRows) {
      return res.status(201).json({
        success: true,
        message: "Upload book successful",
        data: {
          bookId: result.insertId,
        },
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Could not upload book" });
    }
  },
  update: async (req, res) => {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return firstError(res, v, 400);
    }
    const bookValidate = await db.query(
      "SELECT * FROM books WHERE book_id = ?",
      [req.body.bookId]
    );
    if (bookValidate[0].length == 0) {
      return res.status(401).json({
        success: false,
        message: "Book id is not valid.",
      });
    }
    if (bookValidate[0][0].book_author != req.user.uid) {
      return res.status(401).json({
        success: false,
        message: "You are not owner.",
      });
    }
    const updateData = {
      book_name: req.body.bookName,
      book_description: req.body.bookDescription,
      book_price: req.body.bookPrice,
    };
    try {
      const update = await db.query(
        `UPDATE books SET ${Object.keys(updateData)
          .map((key) => `${key} = ?`)
          .join(", ")} WHERE book_id = ?`,
        [...Object.values(updateData), req.body.bookId]
      );
      return res.status(201).json({
        success: true,
        message: "Update book successful",
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.getMessage(),
      });
    }
  },
  delete: async (req, res) => {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return firstError(res, v, 400);
    }
    const bookValidate = await db.query(
      "SELECT * FROM books WHERE book_id = ?",
      [req.body.bookId]
    );
    if (bookValidate[0].length == 0) {
      return res.status(400).json({
        success: false,
        message: "Book id is not valid.",
      });
    }
    if (bookValidate[0][0].book_author != req.user.uid) {
      return res.status(401).json({
        success: false,
        message: "You are not owner.",
      });
    }
    const del = await db.query("DELETE FROM books WHERE book_id = ?", [
      req.body.bookId,
    ]);
    return res.status(200).json({
      success: true,
      message: "Deleted successful.",
    });
  },
};
