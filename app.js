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

const userActivityRoutes = require('./routes/userActivity.routes');
const searchRoutes = require('./routes/search.routes');
const categorySuggestion = require('./routes/categorySuggestion.routes');
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

const saleRoutes = require("./routes/sales.routes");
const app = express();
const cors = require('cors');

app.use(bodyParser.json())

app.use(cors(/*{
  origin: ['http://localhost:53228', 'http://192.168.1.16:3000'], // Add your Flutter Web app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true, // If you're using cookies or Authorization headers
}*/));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});
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



app.use('/sale', saleRoutes);

module.exports = app;