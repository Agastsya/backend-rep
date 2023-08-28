const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "ejs");

app.use(express.static(path.join(path.resolve(), "public")));

app.get("/", (req, res) => {
  res.render("index", { name: "agastsya" });
});

app.listen(5000, () => {
  console.log("Server Is Up And Running");
});
