require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const deckRouter = require("./Decks/deck-router");
const cardRouter = require("./Cards/card-router");
const authRouter = require('./Auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://quick-cardv1-client-jav1v75nw.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/api/auth", authRouter)
app.use("/api/deck", deckRouter);
app.use("/api/card", cardRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
