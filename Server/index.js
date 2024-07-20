const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const auth = require("./middleware/auth");

const app = express();
const mongourl = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB...");

mongoose
  .connect(mongourl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  firstname: { type: "string", unique: true },
  lastname: { type: "string", unique: true },
  username: { type: "string", unique: true },
  email: { type: "string", unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});