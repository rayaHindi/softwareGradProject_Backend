//app.js
const express = require("express");
const bodyParser = require("body-parser")
const UserRoute = require("./routes/user.route");
const productRoute = require("./routes/product.routes");
const storeRoutes = require("./routes/store.router");
const categoryRoutes = require("./routes/category.routes");
const PostRoutes = require("./routes/post.routes");
const { getAllPosts } = require("./controllers/post.controller");
const app = express();
app.use(bodyParser.json())

app.use("/product", productRoute);
app.use("/", UserRoute);
app.use('/store', storeRoutes);
app.use('/category', categoryRoutes);

app.use('/posts', PostRoutes);
app.use('/fetchAllPosts', getAllPosts);


module.exports = app;