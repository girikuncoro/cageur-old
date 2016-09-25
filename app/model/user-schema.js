const db = require('../config/db');
const PatientDiseaseConst = require('./patient-disease-const');
const UserRolesConst = require('./user-roles-const');

const UserSchema = db.Schema({
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  diseases: {
    type: [{ type: String, required: true, enum: PatientDiseaseConst }],
    required: true,
  },
  roles: {
    type: [{ type: String, enum: UserRolesConst }],  // Optional for now
  },
  clinic: { type: String, default: null },  // TODO: implement clinic data model
},
  {
    timestamps: true,
  });

module.exports = UserSchema;
