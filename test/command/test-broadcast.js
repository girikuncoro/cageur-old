const SmsRequest = require('../../app/model/sms-request');
const BroadcastCommand = require('../../app/command/broadcast-action');
const assert = require('assert');

const broadcastHelper = (text) => {
  const sms = new SmsRequest({
    nexmoMessageId: '1',
    fromNumber: '+123',
    toNumber: '+321',
    text,
  });
  return new BroadcastCommand(sms);
};

describe('Broadcast', () => {
  describe('#Command', () => {
    it('should be valid', (done) => {
      const validMsg = [
        'broadcast all good morning',
        'kirim semua good morning',
        'broadcast diabetes good morning',
        'kirim diabetes good morning',
      ];

      validMsg.forEach((msg, i) => {
        const cmd = broadcastHelper(msg);
        assert.equal(true, cmd.valid());
        assert.equal('good morning', cmd.message);

        if (i < 2) {
          assert.equal('all', cmd.group);
        } else {
          assert.equal('diabetes', cmd.group);
        }
      });
      done();
    });

    it('should be valid with short message', (done) => {
      const validMsg = [
        'broadcast all hello',
        'kirim semua hello',
        'broadcast diabetes hello',
        'kirim diabetes hello',
      ];

      validMsg.forEach((msg, i) => {
        const cmd = broadcastHelper(msg);
        assert.equal(true, cmd.valid());
        assert.equal('hello', cmd.message);

        if (i < 2) {
          assert.equal('all', cmd.group);
        } else {
          assert.equal('diabetes', cmd.group);
        }
      });
      done();
    });

    it('should ignore cases and spaces', (done) => {
      const validMsg = [
        'BroaDcast all hello',
        'KirIm semua hello',
        'BROADCAST ALL hello',
        'KIRIM SEMUA hello',
        ' broadcast  all     hello',
        '  kirim  semua   hello',
      ];

      validMsg.forEach((msg) => {
        const cmd = broadcastHelper(msg);
        assert.equal(true, cmd.valid());
        assert.equal('all', cmd.group);
        assert.equal('hello', cmd.message);
      });
      done();
    });

    it('should be invalid', (done) => {
      const invalidMsg = [
        'broadcast all',
        'kirim semua',
        'broadcast',
        'kirim',
        'jokowi',
        'ahok',
      ];
      invalidMsg.forEach((msg) => {
        const cmd = broadcastHelper(msg);
        assert.equal(false, cmd.valid());
      });
      done();
    });
  });

  // TODO: implement broadcast action
  describe('#Action', () => {

  });
});
