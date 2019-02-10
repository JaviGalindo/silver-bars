const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server');
async function run () {
  const mongoServer = new MongoMemoryServer.MongoMemoryServer();
  mongoose.Promise = Promise;
  await mongoServer.getConnectionString().then((mongoUri) => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    mongoose.connect(mongoUri, mongooseOpts);

    // mongoose.connection.on('error', (e) => {
    //   if (e.message.code === 'ETIMEDOUT') {
    //     console.log(e);
    //     mongoose.connect(mongoUri, mongooseOpts);
    //   }
    //   console.log(e);
    // });

    // mongoose.connection.once('open', () => {
    //   console.log(`MongoDB successfully connected to ${mongoUri}`);
    // });
  });
}
run().catch(error => console.error(error.stack));
