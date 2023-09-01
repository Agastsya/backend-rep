const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://127.0.0.1:27017", { dbName: "backend-rep" })
  .then(() => console.log(`Database Connected `))
  .catch((e) => console.log(e));

//CREATING OR GENERATING A MONGOOSE MODEL SCHEMA WHICH GIVES TYPES TO THE MONGOOSE MODEL
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
// USING MIDDLEWARES
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

//this is also a middleware
// This function can be used to authenticate users and next makes sure that the function sends it to the next function
const isAuthenticated = async (req, res, next) => {
  const { tokens } = req.cookies;

  if (tokens) {
    const decoded = jwt.verify(tokens, "helloworldthisisme");
    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.redirect("/register");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "helloworldthisisme");

  res.cookie("tokens", token, {
    expires: new Date(Date.now() + 60 * 1000),
    httpOnly: "true",
  });
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedpassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedpassword,
  });

  const token = jwt.sign({ _id: user._id }, "helloworldthisisme");

  res.cookie("tokens", token, {
    expires: new Date(Date.now() + 60 * 1000),
    httpOnly: "true",
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("tokens", "redhead", {
    httpOnly: "true",
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server Is Up And Running");
});
