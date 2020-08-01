require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const tasksRouter = require("./tasks/tasks-router");
const authRouter = require("./auth/auth-router");

const app = express();
app.use(express.json());

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res, next) => {
  res.send("You've reached app.js");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { message: error.message, error };
  }
  console.error(error);
  res.status(500).json(response);
});

module.exports = app;
