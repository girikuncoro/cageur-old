const db = require('mongoose');

if (process.env.NODE_ENV === 'staging') {
  db.connect(process.env.STAGE_URI);
}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  db.connect(process.env.TEST_URI);
}

module.exports = db;