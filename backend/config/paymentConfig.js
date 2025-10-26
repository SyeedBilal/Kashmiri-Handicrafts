const Razorpay = require('razorpay');
const loadSecrets = require('./awsSecrets'); // or wherever your secret loader is

let razorpayInstance;

async function initializeRazorpay() {
  try {
    // Ensure secrets are loaded
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      await loadSecrets();
    }

    // Verify environment variables are set
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not found in environment variables');
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('✅ Razorpay initialized successfully');
    return razorpayInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Razorpay:', error.message);
    throw error;
  }
}

// Initialize immediately and export promise
const razorpayPromise = initializeRazorpay();

module.exports = razorpayPromise;