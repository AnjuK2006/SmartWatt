const express = require("express");
const cors = require("cors");

const auth = require("./auth.routes");
const energy = require("./energy.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api", energy);

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);