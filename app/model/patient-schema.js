const db = require('../config/db');
const PatientDiseaseEnum = require('./patient-disease-enum');

const PatientSchema = db.Schema({
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  diseases: {
    type: [{ type: String, required: true, enum: PatientDiseaseEnum }],
  },
},
  {
    timestamps: true,
  });

module.exports = PatientSchema;
