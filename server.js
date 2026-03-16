require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

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
  res.send("Server is live! Ready for Vercel and Supabase integration.");
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    //need to add create new user
    console.log(`New signup attempt: ${email}`);
    console.log(`New signup attempt: ${password}`);
    res.status(201).json({ message: "User data received successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Checking if server is  running on http://localhost:${PORT}`);
});
