const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://rajlicdavid:${password}@gotovljskaliga.ho2ghjr.mongodb.net/?appName=GotovljskaLiga`;
const express = require("express");
const cors = require("cors");
const createError = require("http-errors");

// connect  to mongodb
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = 4000;
const app = express();
app.listen(PORT);

// connect frontend to backend
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:4000"] }));
app.use(cors());

// needed to transport data from fromntend to backedn (name of team for example)
app.use(express.json());

const teamsRouter = require("./routes/TeamRoutes");
app.use("/teams", teamsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
