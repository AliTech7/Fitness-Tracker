const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");


app.use("/public", express.static("public"));
require("dotenv").config();

// Connect to MongoDB
require("./config/mongoose.config");

app.use(cookieParser(), express.json(), express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Route configuration
const ActivityRoutes = require("./routes/activity.route");
const UsersRoutes = require("./routes/user.route");

app.use("/api/activities", ActivityRoutes);
app.use("/api/users", UsersRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`>>> Server running on Port: ${port}`);
});
