import db from '../config/db';
import patientDiseaseEnum from './patient-disease-enum';

const patientSchema = db.schema({
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  diseases: {
    type: [{ type: String, required: true, enum: patientDiseaseEnum }],
  },
},
  {
    timestamps: true,
  });

export default patientSchema;
