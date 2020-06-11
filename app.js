const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(morgan());
app.use(cors());
app.use(helmet());

app.get("/", (req, res, next) => {
  res.send("stuff");
});
