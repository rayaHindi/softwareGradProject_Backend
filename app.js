//app.js
const express = require("express");
const bodyParser = require("body-parser")
const UserRoute = require("./routes/user.route");
const productRoute = require("./routes/product.routes");
const storeRoutes = require("./routes/store.router");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const cityRoutes = require("./routes/city.routes");
const favStoresRoutes = require("./routes/favoriteStores.routes");
const advertisementRoutes = require("./routes/advertisement.routes");
const userActivityRoutes =require('./routes/userActivity.routes');
const searchRoutes =require('./routes/search.routes');
const categorySuggestion =require('./routes/categorySuggestion.routes');

const PostRoutes = require("./routes/post.routes");
const { getAllPosts } = require("./controllers/post.controller");

const profileRoutes = require("./routes/profile.routes");

const app = express();
app.use(bodyParser.json())

app.use("/product", productRoute);
app.use("/", UserRoute);
app.use('/store', storeRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/city', cityRoutes);
app.use("/favoriteStores", favStoresRoutes);
app.use("/advertisement", advertisementRoutes);
app.use("/userActivity", userActivityRoutes);
app.use("/search", searchRoutes);
app.use("/categorySuggestion", categorySuggestion);

app.use('/posts', PostRoutes);
app.use('/fetchAllPosts', getAllPosts);
//app.use("/",ToDoRoute);

app.use("/profile", profileRoutes);

require('./tasks/expireAdvertisements');

module.exports = app;