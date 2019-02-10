const express = require('express');
const app = express();
require('./db');
const OrderController = require('./order/OrderController');
app.use('/orders', OrderController);

module.exports = app;
