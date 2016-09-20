const db = require('../config/db');

const SmsRequestSchema = db.Schema({
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  body: { type: String, required: true },

  // SMS processed state
  processed: { type: Boolean, required: true, default: false },
},
  {
    timestamps: true,
  });

module.exports = SmsRequestSchema;
