// backend/config/paymentConfig.js
const AWS = require('aws-sdk');
const Razorpay = require('razorpay');

const secretsManager = new AWS.SecretsManager({ region: 'ap-south-1' });

const razorpayPromise = (async () => {
  console.log("🔐 Fetching Razorpay keys from AWS Secrets Manager...");

  const data = await secretsManager.getSecretValue({ SecretId: 'Kash-Handi-Secrets' }).promise();
  const secrets = JSON.parse(data.SecretString);

 
  process.env.RAZORPAY_KEY_ID = secrets.RAZORPAY_KEY_ID;
  process.env.RAZORPAY_KEY_SECRET = secrets.RAZORPAY_KEY_SECRET;


  console.log("✅ Razorpay keys loaded successfully");

  // Now safely create Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpay;
})();

module.exports = razorpayPromise;


