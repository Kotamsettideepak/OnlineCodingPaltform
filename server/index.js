require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.APP_PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the Images directory
app.use("/images", express.static(path.join(__dirname, "public/Images")));

// Import routes for admin
const adminRoute = require("./src/Router/Admin.js");

// Import routes for client
const compileRoute = require("./src/Router/compile");
const playgroundRoute = require("./src/Router/playground.js");
const arenaRoute = require("./src/Router/arena.js");
const battleGroundRouter = require("./src/Router/battleground.js");

mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log("Not Connected", err));

// Use routes

// For admin
app.use("/admin", adminRoute);

// For client
app.use("/execute", compileRoute);
app.use("/playground", playgroundRoute);
app.use("/arena", arenaRoute);
app.use("/battleground", battleGroundRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
