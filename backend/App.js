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
  .catch((err) => console.log(err + "hehehe"));

const PORT = 4000;
const app = express();
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

// connect frontend to backend
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:4000"] }));
//app.use(cors());
/*app.use(
  cors({
    origin: [
      "https://gotovljska-liga-frontend.vercel.app/",
      "https://gotovljska-liga.vercel.app/",
      "http://localhost:3000",
      "http://localhost:4000",
    ],
  })
);
*/

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://gotovljska-liga-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Če origin ni podan (npr. pri curl ali kakšnih drugih CLI orodjih), dovoli dostop
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        // Če je origin na seznamu dovoljenih, dovoli dostop
        callback(null, true);
      } else {
        // Če ni dovoljen, zavrni dostop
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
// needed to transport data from fromntend to backend (name of team for example)
app.use(express.json());

// Tvoja express koda tukaj
app.get("/", (req, res) => {
  res.send("CORS je pravilno nastavljen");
});

const teamsRouter = require("./routes/TeamRoutes");
const playersRouter = require("./routes/playerRoutes");
const roundsRouter = require("./routes/roundRoutes");
const matchesRouter = require("./routes/matchRoutes");
app.use("/teams", teamsRouter);
app.use("/players", playersRouter);
app.use("/rounds", roundsRouter);
app.use("/matches", matchesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
