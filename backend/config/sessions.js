const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const loadSecrets = require('./awsSecrets');

let sessionConfig; // will hold the final config

async function initSession() {
  await loadSecrets(); // ensure secrets are loaded first

  const store = new MongoDbStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  store.on('error', (error) => {
    console.log('Session store error:', error);
  });

  sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    },
  });

  return sessionConfig;
}

module.exports = initSession;
