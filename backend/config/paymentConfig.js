const Razorpay = require('razorpay');
const loadSecrets = require('./awsSecrets');

let razorpayInstance;

async function initRazorpay() {
  await loadSecrets(); // ✅ wait for secrets to load

  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayInstance;
}

module.exports = initRazorpay;
