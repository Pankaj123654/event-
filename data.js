const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

// Serve static files from the 'event' directory
app.use(express.static('event'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


const User = mongoose.model("User", userSchema);

app.post("/save-user", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({ email, password });

  try {
    await newUser.save();
    res.redirect("/user.html");
  } catch (err) {
    console.error("Error saving user data:", err);
    res.status(500).send("Error saving user data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
