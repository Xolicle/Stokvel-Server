const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/user/:supabaseId", async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.supabaseId });

    if (!user) {
      return res.status(404).json({ message: "User not found in MongoDB" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

app.post("/api/save-user", async (req, res) => {
  try {
    const { supabaseId, email, username } = req.body;

    const existingUser = await User.findOne({ supabaseId });
    if (existingUser)
      return res.status(200).json({ message: "User already synced" });

    const newUser = new User({ supabaseId, email, username });
    await newUser.save();

    res.status(201).json({ message: "User synced to MongoDB successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to sync" });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database Error:", err));

app.listen(5000, () => console.log("Server running"));
