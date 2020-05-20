const PORT = process.env.PORT || 3000

const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render('index');
});

app.listen(PORT, function () {
  console.log("Server is running...");
});
