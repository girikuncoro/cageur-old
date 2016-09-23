const app = require('../../server');
const Patient = require('../../app/model/patient');
const request = require('supertest');
const assert = require('assert');


describe('Patient API', () => {
  describe('#POST request', () => {
    const newPatient = {
      phoneNumber: '+111',
      firstName: 'cecep',
      lastName: 'supriadi',
      diseases: ['diabetes'],
    };

    beforeEach((done) => {
      Patient.remove(_ => done());
    });

    it('should insert new patient data', (done) => {
      request(app)
      .post('/api/v1/patient')
      .send(newPatient)
      .end((_, res) => {
        Patient.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(200, r.status);
          assert.equal('success', r.message);
          assert.equal(1, total);

          assert.equal('+111', r.patient.phoneNumber);
          assert.equal('cecep', r.patient.firstName);
          assert.deepEqual(['diabetes'], r.patient.diseases);
          done();
        });
      });
    });

    it('should not insert data without phoneNumber', (done) => {
      const invalidPatient = {
        firstName: 'cecep',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/patient')
      .send(invalidPatient)
      .end((_, res) => {
        Patient.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for patient', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data without firstName', (done) => {
      const invalidPatient = {
        phoneNumber: '+111',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/patient')
      .send(invalidPatient)
      .end((_, res) => {
        Patient.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for patient', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data without diseases', (done) => {
      const invalidPatient = {
        phoneNumber: '+111',
        firstName: 'cecep',
        lastName: 'supriadi',
      };

      request(app)
      .post('/api/v1/patient')
      .send(invalidPatient)
      .end((_, res) => {
        Patient.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for patient', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data when phoneNumber exist', (done) => {
      const patientExist = {
        phoneNumber: '+111',
        firstName: 'cecep',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/patient')
      .send(patientExist)
      .end((_, ____) => {
        request(app)
        .post('/api/v1/patient')
        .send(patientExist)
        .end((__, res2) => {
          Patient.count({}, (___, total) => {
            const r = JSON.parse(res2.text);
            assert.equal(400, r.status);
            assert.equal('phone number exist', r.message);
            assert.equal(1, total);
            done();
          });
        });
      });
    });
  });

  describe('#GET request', () => {
    let validID;

    before((done) => {
      const patient1 = {
        phoneNumber: '+123',
        firstName: 'ayu',
        diseases: ['diabetes'],
      };

      const patient2 = {
        phoneNumber: '+456',
        firstName: 'budi',
        diseases: ['uric acid', 'diabetes'],
      };

      Patient.remove((_) => {
        Patient.insertMany([patient1, patient2], (__, patients) => {
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

    it('should get 404 if patientID not found', (done) => {
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

    it('should get 404 if phoneNumber not found', (done) => {
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
});
