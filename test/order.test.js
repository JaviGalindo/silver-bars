/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
require('../server');
const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

const ordersToCreate = [
  {
    'userId': 'user1',
    'quantity': 3.5,
    'price': 306,
    'type': 'SELL'
  },
  {
    'userId': 'user2',
    'quantity': 1.2,
    'price': 310,
    'type': 'SELL'
  },
  {
    'userId': 'user3',
    'quantity': 307,
    'price': 8,
    'type': 'SELL'
  },
  {
    'userId': 'user4',
    'quantity': 306,
    'price': 8,
    'type': 'SELL'
  },
  {
    'userId': 'user4',
    'quantity': 11.50,
    'price': 150,
    'type': 'BUY'
  },
  {
    'userId': 'user5',
    'quantity': 15.50,
    'price': 12,
    'type': 'BUY'
  }
];
const failOrder = {
  'userId': 1,
  'quantity': 11.50,
  'price': 8,
  'type': 'failType'
};
let idToDelete = '';
// eslint-disable-next-line no-undef
describe('Testing Creation Read and delete of orders', function () {
  ordersToCreate.map(order => {
    it('Should create an order', async () => {
      let orderCreated = await axios.post('http://localhost:3000/orders', order);
      expect(orderCreated.data._id).to.not.be.undefined;
      expect(orderCreated.data.userId).to.equal(order.userId);
      expect(orderCreated.data.quantity).to.equal(order.quantity);
      expect(orderCreated.data.price).to.equal(order.price);
      expect(orderCreated.data.type).to.equal(order.type);
      idToDelete = orderCreated.data._id;
    });
  });

  it('Should retrieve more than 0 orders', async () => {
    const orders = await axios.get('http://localhost:3000/orders');
    expect(orders.length).to.not.equal(0);
  });

  it('Should retrieve all the orders created before', async () => {
    const orders = await axios.get('http://localhost:3000/orders');
    expect(ordersToCreate.length).to.equal(orders.data.length);
  });

  it('Should return an error creating the order because type is not allowed', async () => {
    try {
      const orders = await axios.post('http://localhost:3000/orders', failOrder);
      console.log(orders);
    } catch (error) {
      expect(error.response.status).to.equal(500);
      expect(error.response.data).to.equal(`There was a problem creating the order. Error: ValidationError: type: \`${failOrder.type}\` is not a valid enum value for path \`type\`.`);
    }
  });

  it('Should delete the order', async () => {
    const deleted = await axios.delete('http://localhost:3000/orders', { data: { orderId: idToDelete } });
    expect(deleted.data).to.be.equal('Deleted');
  });

  it('Should retrieve all the orders minus one', async () => {
    const orders = await axios.get('http://localhost:3000/orders');
    expect(ordersToCreate.length - 1).to.equal(orders.data.length);
  });
});
