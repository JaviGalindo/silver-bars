/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/**
 * Please run first npm start or require('../server') to run the app server
 */
const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

const url = 'http://localhost:3000/orders';
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
    'quantity': 1.5,
    'price': 307,
    'type': 'SELL'
  },
  {
    'userId': 'user4',
    'quantity': 2.0,
    'price': 306,
    'type': 'SELL'
  },
  {
    'userId': 'user4',
    'quantity': 20.50,
    'price': 300,
    'type': 'BUY'
  },
  {
    'userId': 'user5',
    'quantity': 20,
    'price': 300,
    'type': 'BUY'
  },
  {
    'userId': 'user7',
    'quantity': 5,
    'price': 200,
    'type': 'BUY'
  },
  {
    'userId': 'user8',
    'quantity': 10,
    'price': 200,
    'type': 'BUY'
  },
  {
    'userId': 'user6',
    'quantity': 20,
    'price': 300,
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
const expectedNumGroupedOrders = 5;
describe('Testing Creation Read and delete of orders', function () {
  let i = 0;
  ordersToCreate.map(order => {
    it(`${i++} - Should create an order for user ${order.userId}`, async () => {
      let orderCreated = await axios.post(url, order);
      expect(orderCreated.data._id).to.not.be.undefined;
      expect(orderCreated.data.userId).to.equal(order.userId);
      expect(orderCreated.data.quantity).to.equal(order.quantity);
      expect(orderCreated.data.price).to.equal(order.price);
      expect(orderCreated.data.type).to.equal(order.type);
      idToDelete = orderCreated.data._id;
    });
  });

  it('Should retrieve more than 0 orders', async () => {
    const orders = await axios.get(url);
    expect(orders.length).to.not.equal(0);
  });

  it('Should retrieve all the orders created before', async () => {
    const orders = await axios.get(url + '/all');
    expect(ordersToCreate.length).to.equal(orders.data.length);
  });

  it('Should return an error creating the order because type is not allowed', async () => {
    try {
      const orders = await axios.post(url, failOrder);
      console.log(orders);
    } catch (error) {
      expect(error.response.status).to.equal(500);
      expect(error.response.data).to.equal(`There was a problem creating the order. Error: ValidationError: type: \`${failOrder.type}\` is not a valid enum value for path \`type\`.`);
    }
  });

  it('Should delete the order', async () => {
    const deleted = await axios.delete(url, { data: { orderId: idToDelete } });
    expect(deleted.data).to.be.equal('Deleted');
  });

  it('Should retrieve all the orders minus one', async () => {
    const orders = await axios.get(url + '/all');
    expect(ordersToCreate.length - 1).to.equal(orders.data.length);
  });

  it('Should retrieve the orders grouped by price and type', async () => {
    const orders = await axios.get(url);
    expect(expectedNumGroupedOrders).to.equal(orders.data.length);

    expect(orders.data[0]).to.equal('(BUY) 40.5 kg for £300');
    expect(orders.data[1]).to.equal('(BUY) 15 kg for £200');
    expect(orders.data[2]).to.equal('(SELL) 5.5 kg for £306');
    expect(orders.data[3]).to.equal('(SELL) 1.5 kg for £307');
    expect(orders.data[4]).to.equal('(SELL) 1.2 kg for £310');
  });
});
