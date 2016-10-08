const db = require('../config/db');

const SmsOutSchema = db.Schema({
  groupId: { type: String, required: true },
  message: { type: String, required: true },
  timeSchedules: [{ type: Number }],
  frequency: { type: String, enum: ['once', 'daily', 'monthly'], default: 'once' },

  // start time if schedule
  timeStart: { type: Number, required: true },
  clinic: { type: String, required: true },  // TODO: implement clinic data model
},
  {
    timestamps: true,
  });

module.exports = SmsOutSchema;
