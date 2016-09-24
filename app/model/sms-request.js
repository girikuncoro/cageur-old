const db = require('../config/db');
const SmsRequestSchema = require('./sms-request-schema');

const SmsRequest = db.model('SmsRequest', SmsRequestSchema);

module.exports = SmsRequest;
