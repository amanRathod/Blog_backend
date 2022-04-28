const mongoose = require('mongoose');

// pooling connection for monogoDB connection pooling for poolSize is 10
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


const connectDB = async() => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      poolSize: 10,
    });
    // console.log(connect);
    console.log(`MongoDb connected ${connect.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
