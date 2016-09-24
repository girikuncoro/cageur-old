const app = require('../../server');
const User = require('../../app/model/user');
const request = require('supertest');
const assert = require('assert');


describe('User API', () => {
  describe('#POST /api/v1/user', () => {
    const newUser = {
      phoneNumber: '+111',
      firstName: 'cecep',
      lastName: 'supriadi',
      diseases: ['diabetes'],
    };

    beforeEach((done) => {
      User.remove(_ => done());
    });

    it('should insert new user data', (done) => {
      request(app)
      .post('/api/v1/user')
      .send(newUser)
      .end((_, res) => {
        User.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(200, r.status);
          assert.equal('success', r.message);
          assert.equal(1, total);

          assert.equal('+111', r.user.phoneNumber);
          assert.equal('cecep', r.user.firstName);
          assert.deepEqual(['diabetes'], r.user.diseases);
          done();
        });
      });
    });

    it('should not insert data without phoneNumber', (done) => {
      const invalidUser = {
        firstName: 'cecep',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/user')
      .send(invalidUser)
      .end((_, res) => {
        User.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for user', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data without firstName', (done) => {
      const invalidUser = {
        phoneNumber: '+111',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/user')
      .send(invalidUser)
      .end((_, res) => {
        User.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for user', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data without diseases', (done) => {
      const invalidUser = {
        phoneNumber: '+111',
        firstName: 'cecep',
        lastName: 'supriadi',
      };

      request(app)
      .post('/api/v1/user')
      .send(invalidUser)
      .end((_, res) => {
        User.count({}, (__, total) => {
          const r = JSON.parse(res.text);
          assert.equal(401, r.status);
          assert.equal('missing required field for user', r.message);
          assert.equal(0, total);
          done();
        });
      });
    });

    it('should not insert data when phoneNumber exist', (done) => {
      const userExist = {
        phoneNumber: '+111',
        firstName: 'cecep',
        lastName: 'supriadi',
        diseases: ['diabetes'],
      };

      request(app)
      .post('/api/v1/user')
      .send(userExist)
      .end((_, ____) => {
        request(app)
        .post('/api/v1/user')
        .send(userExist)
        .end((__, res2) => {
          User.count({}, (___, total) => {
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

  describe('#GET /api/v1/user', () => {
    let validID;

    before((done) => {
      const user1 = {
        phoneNumber: '+123',
        firstName: 'ayu',
        diseases: ['diabetes'],
      };

      const user2 = {
        phoneNumber: '+456',
        firstName: 'budi',
        diseases: ['uric acid', 'diabetes'],
      };

      User.remove((_) => {
        User.insertMany([user1, user2], (__, users) => {
          validID = users[1]._id;
          done();
        });
      });
    });

    it('should get one user data by userID', (done) => {
      request(app)
      .get(`/api/v1/user/id/${validID}`)
      .end((_, res) => {
        const r = JSON.parse(res.text);
        assert.equal(200, r.status);
        assert.equal('success', r.message);

        assert.equal('+456', r.user.phoneNumber);
        assert.equal('budi', r.user.firstName);
        assert.deepEqual(['uric acid', 'diabetes'], r.user.diseases);
        done();
      });
    });

    it('should get one user data by phoneNumber', (done) => {
      const validPhone = '+123';

      request(app)
      .get(`/api/v1/user/phone/${validPhone}`)
      .end((_, res) => {
        const r = JSON.parse(res.text);
        assert.equal(200, r.status);
        assert.equal('success', r.message);

        assert.equal('+123', r.user.phoneNumber);
        assert.equal('ayu', r.user.firstName);
        assert.deepEqual(['diabetes'], r.user.diseases);
        done();
      });
    });

    it('should get 404 if userID not found', (done) => {
      const invalidID = 'blah';

      request(app)
      .get(`/api/v1/user/id/${invalidID}`)
      .end((err, res) => {
        const r = JSON.parse(res.text);
        assert.equal(404, r.status);
        assert.equal('user not found', r.message);
        done();
      });
    });

    it('should get 404 if phoneNumber not found', (done) => {
      const invalidPhone = '+000';

      request(app)
      .get(`/api/v1/user/phone/${invalidPhone}`)
      .end((err, res) => {
        const r = JSON.parse(res.text);
        assert.equal(404, r.status);
        assert.equal('user not found', r.message);
        done();
      });
    });
  });
});
