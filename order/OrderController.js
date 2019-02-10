const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const Order = require('./Order');

/**
 * Create new order for a User
 * @param Order
 */
router.post('/', async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.body.userId,
      quantity: req.body.quantity,
      price: req.body.price,
      type: req.body.type
    });
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send(`There was a problem creating the order. Error: ${error}`);
  }
});

/**
 * Return a list of orders
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});

    const response = orders.map(order => `${order.type}: ${order.quantity} kg £${order.price} `);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send('There was a problem finding the orders.');
  }
});

/**
 * Delete an order by the Id
 * @param String orderId
 */
router.delete('/', async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.body.orderId });
    return res.status(200).send('Deleted');
  } catch (error) {
    return res.status(500).send(error);
  }
});
// const summaryOrders = (orders) => {
//   return xs.reduce(function (rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };
module.exports = router;
