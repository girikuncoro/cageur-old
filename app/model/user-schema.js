const db = require('../config/db');
const PatientDiseaseEnum = require('./patient-disease-enum');
const UserRolesEnum = require('./user-roles-enum');

const UserSchema = db.Schema({
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  diseases: {
    type: [{ type: String, required: true, enum: PatientDiseaseEnum }],
    required: true,
  },
  roles: {
    type: [{ type: String, enum: UserRolesEnum }],  // Optional for now
  },
},
  {
    timestamps: true,
  });

module.exports = UserSchema;
