const mongoose = require('mongoose');
const orderType = ['BUY', 'SELL'];
const OrderSchema = new mongoose.Schema({
  userId: String,
  quantity: Number,
  price: Number,
  type: {
    type: String,
    enum: orderType
  }
});
mongoose.model('Order', OrderSchema);
module.exports = mongoose.model('Order');
