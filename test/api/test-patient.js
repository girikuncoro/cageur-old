process.env.NODE_ENV = 'test';

const Patient = require('../../app/model/patient');
const app = require('../../server');
const request = require('supertest');
const assert = require('assert');


describe('Patient API', () => {
  let validID;

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
        validID = patients[1]._id;
        done();
      });
    });
  });

  it('should get one patient data by patientID', (done) => {
    request(app)
    .get(`/api/v1/patient/id/${validID}`)
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

  it('should get one patient data by phoneNumber', (done) => {
    const validPhone = '+123';

    request(app)
    .get(`/api/v1/patient/phone/${validPhone}`)
    .end((_, res) => {
      const r = JSON.parse(res.text);
      assert.equal(200, r.status);
      assert.equal('success', r.message);

      assert.equal('+123', r.patient.phoneNumber);
      assert.equal('ayu', r.patient.firstName);
      assert.deepEqual(['diabetes'], r.patient.diseases);
      done();
    });
  });

  it('should get error if patientID not found', (done) => {
    const invalidID = 'blah';

    request(app)
    .get(`/api/v1/patient/id/${invalidID}`)
    .end((err, res) => {
      const r = JSON.parse(res.text);
      assert.equal(404, r.status);
      assert.equal('patient not found', r.message);
      done();
    });
  });

  it('should get error if phoneNumber not found', (done) => {
    const invalidPhone = '+000';

    request(app)
    .get(`/api/v1/patient/phone/${invalidPhone}`)
    .end((err, res) => {
      const r = JSON.parse(res.text);
      assert.equal(404, r.status);
      assert.equal('patient not found', r.message);
      done();
    });
  });
});
