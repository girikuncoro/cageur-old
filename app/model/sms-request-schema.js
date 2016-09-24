const db = require('../config/db');

const SmsRequestSchema = db.Schema({
  nexmoMessageId: { type: String, required: true },
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  text: { type: String, required: true },
  responseMsg: { type: String, default: '' },

  // SMS processed state
  processed: { type: Boolean, default: false },
  tsProcessed: { type: Date },

  user: { type: db.Schema.Types.ObjectId, ref: 'User' },
},
  {
    timestamps: true,
  });

module.exports = SmsRequestSchema;
