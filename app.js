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
const subscriptionPlan =require('./routes/SubscriptionPlan.routes');
const fcmToken =require('./routes/fcmToken.routes');
const notification = require('./routes/notification.routes');
const specialOrder = require('./routes/specialOrder.routes');
const storeSpecialOrderOption = require('./routes/storeSpecialOrderOption.routes');

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
app.use("/subscriptionPlan",subscriptionPlan);
app.use('/posts', PostRoutes);
app.use('/fetchAllPosts', getAllPosts);
//app.use("/",ToDoRoute);
app.use('/specialOrder', specialOrder);
app.use('/storeSpecialOrderOption', storeSpecialOrderOption);

app.use("/profile", profileRoutes);
app.use('/fcmToken', fcmToken);
app.use('/notification', notification);

require('./tasks/expireAdvertisements');

module.exports = app;