const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");

mongoose
  .connect("mongodb://127.0.0.1:27017", { dbName: "backend-rep" })
  .then(() => console.log(`Database Connected `))
  .catch((e) => console.log(e));

//CREATING OR GENERATING A MONGOOSE MODEL SCHEMA WHICH GIVES TYPES TO THE MONGOOSE MODEL
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);
// USING MIDDLEWARES
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

//this is also a middleware
// This function can be used to authenticate users and next makes sure that the function sends it to the next function
const isAuthenticated = (req, res, next) => {
  const { tokens } = req.cookies;

  if (tokens) {
    next();
  } else {
    res.render("login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout");
});

app.post("/login", async (req, res) => {
  const { name, email } = req.body;

  await User.create({
    name: name,
    email: email,
  });

  res.cookie("tokens", "redhead", {
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
