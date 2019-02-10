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
 * Return a list of orders with the total quantity and grouped by Type and Price
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { price: '$price', type: '$type' },
          userId: { $last: '$userId' },
          type: { $last: '$type' },
          price: { $last: '$price' },
          sumQuantity: { $sum: '$quantity' }
        }
      }
    ]);
    const sortedOrders = sortByType(orders);
    const response = returnString(sortedOrders);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(`There was a problem finding the orders. ${error}`);
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send(`There was a problem finding the orders. ${error}`);
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

const sortByType = (orders) => {
  console.log('Sorting by type...');

  const sortBuyOrders = orders.filter(order => order.type === 'BUY').sort((first, previous) => previous.price - first.price);
  const sortSellOrders = orders.filter(order => order.type === 'SELL').sort((first, previous) => first.price - previous.price);
  return [...sortBuyOrders, ...sortSellOrders];
};
const returnString = (orders) => orders.map(order => `(${order.type}) ${order.sumQuantity} kg for £${order.price}`);
module.exports = router;
