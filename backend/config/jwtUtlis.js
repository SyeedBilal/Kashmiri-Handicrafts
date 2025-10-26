const jwt = require('jsonwebtoken');
const loadSecrets = require('./awsSecrets');

let JWT_SECRET;

(async () => {
  await loadSecrets();
  JWT_SECRET = process.env.JWT_SECRET;
})();

exports.generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });
exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);
