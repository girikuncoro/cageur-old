const db = require('../config/db');
const PatientSchema = require('./patient-schema');

const Patient = db.model('Patient', PatientSchema);

module.exports = Patient;
