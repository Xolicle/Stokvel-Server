require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const User = require("../models/User");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Server is live!");
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const newUser = new User({ email, username, password });

    await newUser.save();

    res.status(201).json({ message: "User created in MongoDB successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create user. Email might already exist." });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful!", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Checking if server is  running on http://localhost:${PORT}`);
});
