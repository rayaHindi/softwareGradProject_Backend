//app.js
const express = require("express");
const bodyParser = require("body-parser")
const UserRoute = require("./routes/user.route");
const productRoute = require("./routes/product.routes");
const app = express();
app.use(bodyParser.json())

app.use("/product", productRoute);
app.use("/", UserRoute);

//app.use("/",ToDoRoute);
module.exports = app;