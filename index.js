const express = require("express");
const path = require("path");

const app = express();

const userInfo = [];

// USING MIDDLEWARES
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { name: "Agastsya" });
});

app.get("/add", (req, res) => {
  res.send("nice");
});

app.get("/users", (req, res) => {
  res.json({
    userInfo,
  });
});

app.post("/", (req, res) => {
  userInfo.push({
    userName: req.body.name,
    useEmail: req.body.email,
  });
  //res.redirect("/success") you will have to create a new route for this and you can render success page there it is also a way
  res.render("success", { users: userInfo });
});

app.listen(5000, () => {
  console.log("Server Is Up And Running");
});
