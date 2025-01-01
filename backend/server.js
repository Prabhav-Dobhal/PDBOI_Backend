const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
// Redirect all non-prefixed routes to `/api`
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    req.url = `/api${req.url}`; // Prepend '/api' to the request URL
  }
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  });

// Routes
app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
