module.exports = (app) => {
  app.use("/auth", require("./auth.js"));
  app.use("/books", require("./books.js"));
};
