const mongoose = require('mongoose');
require('dotenv').config();
const EmailSubscription = require('./models/EmailSubscription');

const clear = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seniorly');
  await EmailSubscription.deleteMany({});
  console.log('Cleared all email subscriptions');
  process.exit();
};

clear();
