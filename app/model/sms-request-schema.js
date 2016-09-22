const db = require('../config/db');

const SmsRequestSchema = db.Schema({
  nexmoMessageId: { type: String, required: true },
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  text: { type: String, required: true },

  // SMS processed state
  processed: { type: Boolean, required: true, default: false },
  tsProcessed: { type: Date },
},
  {
    timestamps: true,
  });

module.exports = SmsRequestSchema;
