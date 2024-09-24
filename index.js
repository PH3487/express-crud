const express = require("express");
const app = express();
const logger = require("morgan");
require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: false }));

// Correct route mounting
require("./routes")(app);

app.listen(process.env.PORT, () => {
  console.log(`Application started on http://localhost:${process.env.PORT}`);
});
module.exports = { app };
