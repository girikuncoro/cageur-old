import db from '../config/db';
import patientSchema from './patient-schema';

const Patient = db.model('Patient', patientSchema);

export default Patient;
