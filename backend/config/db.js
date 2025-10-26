const mongoose = require('mongoose');


const loadSecrets=require('./awsSecrets');



const connectDB = async () => {
  try {
    await loadSecrets(); // Load AWS secrets before connecting to DB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
