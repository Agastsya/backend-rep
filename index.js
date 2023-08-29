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
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Message = mongoose.model("Message", messageSchema);
// USING MIDDLEWARES
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/contact", (req, res) => {
  res.render("index", { name: "Agastsya" });
});

app.get("/users", (req, res) => {
  res.json({
    userInfo,
  });
});

app.post("/contact", async (req, res) => {
  // const messageData = {
  //   name: req.body.name,
  //   email: req.body.email,
  // };
  const { name, email } = req.body;
  await Message.create({ name, email });
  //res.redirect("/success") you will have to create a new route for this and you can render success page there it is also a way
  res.render("success", { users: "Agastsya" });
});

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  res.cookie("token", "redhead", {
    httpOnly: "true",
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server Is Up And Running");
});
