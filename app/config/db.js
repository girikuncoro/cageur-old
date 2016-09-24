const db = require('mongoose');
db.Promise = require('bluebird');

if (process.env.NODE_ENV === 'staging') {
  db.connect(process.env.STAGE_URI);
}
else if (process.env.NODE_ENV === 'development') {
  db.connect(process.env.MONGO_DEV_URI);
}
else if (process.env.NODE_ENV === 'test') {
  db.connect(process.env.MONGO_TEST_URI);
}

module.exports = db;
