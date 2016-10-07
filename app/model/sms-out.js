const db = require('../config/db');
const SmsOutSchema = require('./sms-out-schema');

const SmsOut = db.model('SmsOut', SmsOutSchema);

module.exports = SmsOut;
