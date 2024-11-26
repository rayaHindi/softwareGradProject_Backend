const express = require('express');
const body_parser = require('body-parser');
const userRouter = require('./routers/user.router');
const storeRoutes = require('./routers/store.router');



const app = express();

app.use(body_parser.json());
app.use('/user', userRouter);
app.use('/store', storeRoutes);

module.exports = app;