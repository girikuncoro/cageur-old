process.env.NODE_ENV = 'test';

const Patient = require('../../app/model/patient');
const app = require('../../server');
const request = require('supertest');
const assert = require('assert');


describe('Patient API', () => {
  let patientID;

  before((done) => {
    const newPatient1 = {
      phoneNumber: '+123',
      firstName: 'ayu',
      diseases: ['diabetes'],
    };

    const newPatient2 = {
      phoneNumber: '+456',
      firstName: 'budi',
      diseases: ['uric acid', 'diabetes'],
    };

    Patient.remove((_) => {
      Patient.insertMany([newPatient1, newPatient2], (__, patients) => {
        patientID = patients[1]._id;
        done();
      });
    });
  });

  it('should get one patient data', (done) => {
    request(app)
    .get(`/api/v1/patient/id/${patientID}`)
    .end((_, res) => {
      const r = JSON.parse(res.text);
      assert.equal(200, r.status);
      assert.equal('success', r.message);

      assert.equal('+456', r.patient.phoneNumber);
      assert.equal('budi', r.patient.firstName);
      assert.deepEqual(['uric acid', 'diabetes'], r.patient.diseases);
      done();
    });
  });
});
