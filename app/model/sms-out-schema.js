const db = require('../config/db');
const PatientDiseaseConst = require('./patient-disease-const');

const SmsOutSchema = db.Schema({
  group: {
    type: [{ type: String, required: true, enum: PatientDiseaseConst }],
    required: true,
  },
  message: { type: String, required: true },

  scheduled: { type: Boolean, default: false },
  repeat: { type: String, enum: ['none', 'daily', 'monthly'], default: 'none' },
  quantity: { type: Number, default: 0 },

  time: { type: Date, required: true },
  clinic: { type: String, required: true },  // TODO: implement clinic data model
},
  {
    timestamps: true,
  });

module.exports = SmsOutSchema;
