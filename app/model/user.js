const db = require('../config/db');
const UserSchema = require('./user-schema');

const User = db.model('User', UserSchema);

module.exports = User;
