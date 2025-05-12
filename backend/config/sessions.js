const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);




const store = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
});

// Handle store errors
store.on('error', function(error) {
  console.log('Session store error:', error);
});

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Changed to false to comply with GDPR
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
    httpOnly: true,
    secure: true,
    sameSite: 'none', 
  },
});

module.exports = sessionConfig;