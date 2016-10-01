const app = require('../../server');
const SmsRequest = require('../../app/model/sms-request');
const User = require('../../app/model/user');
const request = require('supertest');
const assert = require('assert');


describe('Sms API', () => {
  describe('#GET /api/v1/sms/nexmo', () => {
    const user = new User({
      phoneNumber: '+111',
      firstName: 'cecep',
      lastName: 'supriadi',
      diseases: ['diabetes'],
      clinic: 'medica',
    });
    const incomingSms = {
      messageId: '1',
      to: '+123',
      msisdn: '+111',
      text: 'test message',
    };

    before((done) => {
      user.save(_ => done());
    });

    beforeEach((done) => {
      SmsRequest.remove(_ => done());
    });

    it('should get sms response', (done) => {
      request(app)
      .get('/api/v1/sms/nexmo')
      .query(incomingSms)
      .end((_, res) => {
        const r = JSON.parse(res.text);
        assert.equal(200, r.status);
        assert.equal('success', r.message);
        assert.equal('test message', r.response);
        done();
      });
    });

    it('should be logged in datastore', (done) => {
      request(app)
      .get('/api/v1/sms/nexmo')
      .query(incomingSms)
      .end((_, __) => {
        SmsRequest.count({}, (___, total) => {
          assert.equal(1, total);
          done();
        });
      });
    });

    it('should caught 401 when invalid SMS request', (done) => {
      const invalidSms = {
        messageId: '1',
        to: '+123',
        text: 'test message',
      };
      request(app)
      .get('/api/v1/sms/nexmo')
      .query(invalidSms)
      .end((_, res) => {
        const r = JSON.parse(res.text);
        assert.equal(401, r.status);
        assert.equal('error', r.message);
        assert.equal('Invalid SMS request', r.error);
        done();
      });
    });

    it('should caught 404 when unknown phoneNumber', (done) => {
      const invalidSms = {
        messageId: '1',
        to: '+123',
        msisdn: '+222',  // number not in user db
        text: 'test message',
      };
      request(app)
      .get('/api/v1/sms/nexmo')
      .query(invalidSms)
      .end((_, res) => {
        const r = JSON.parse(res.text);
        assert.equal(404, r.status);
        assert.equal('error', r.message);
        assert.equal('SMS sender not found', r.error);
        done();
      });
    });
  });
});
