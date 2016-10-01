const router = require('express').Router();
const SmsRequest = require('../model/sms-request');
const User = require('../model/user');
const nexmo = require('../config/sms').nexmo;
const abort = require('../util').abort;
const telerivet = require('../config/sms-telerivet');


// Broadcast SMS by phoneNumber
// /api/v1/sms/broadcast
router.post('/broadcast', (req, res, next) => {
  const phoneNumbers = req.body.phoneNumbers;
  const message = req.body.message;

  telerivet.sendMessages({
    content: message,
    to_numbers: phoneNumbers,
  }, (err, _) => {
    if (err) next(abort(401, 'SMS delivery failed'));
  });

  return res.json({
    status: 200,
    message: 'success',
    totalPatient: phoneNumbers.length,
    text: message,
  });
});

// Broadcast SMS by disease group
// /api/v1/sms/broadcast/group
router.post('/broadcast/group', (req, res, next) => {
  const group = req.body.group;
  const message = req.body.message;

  // TODO: fetch clinic from admin's credentials
  User.find({ diseases: group, clinic: 'temporary' })
  .then((patients) => {
    if (patients.length === 0) {
      throw abort(404, 'No patients in this group');
    }
    const phoneNumbers = patients.map(patient => patient.phoneNumber);
    return phoneNumbers;
  })
  .then((phoneNumbers) => {
    telerivet.sendMessages({
      content: message,
      to_numbers: phoneNumbers,
    }, (err, _) => {
      if (err) throw abort(401, 'SMS delivery failed');
    });

    return res.json({
      status: 200,
      message: 'success',
      totalPatient: phoneNumbers.length,
      text: message,
    });
  })
  .catch(err => next(err));
});

// Callback from inbound Nexmo SMS
// /api/v1/sms/nexmo
router.get('/nexmo', (req, res, next) => {
  const newSms = new SmsRequest({
    nexmoMessageId: req.query.messageId,
    fromNumber: req.query.msisdn,
    toNumber: req.query.to,
    text: req.query.text,
  });

  // Store SMS for auditing
  let processedSms;
  let responseMsg;

  newSms.save()
  .then((sms) => {
    processedSms = sms;
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'test') {
      console.log('Inbound Nexmo SMS stored', sms);
    }
    /* eslint-enable no-console */
    return User.findOne({ phoneNumber: sms.fromNumber });
  },
    (err) => { throw abort(401, 'Invalid SMS request', err); }
  )
  .then((user) => {
    // Load application data associated with SMS
    if (!user) {
      throw abort(404, 'SMS sender not found');
    }
    processedSms.user = user._id;
    return processedSms;
  })
  .then((_processedSms) => {
    // TODO: Load response from proper command routing
    // Right now it's just copying back your input
    responseMsg = _processedSms.text;
    if (responseMsg) {
      nexmo.message.sendSms(
        newSms.toNumber, newSms.fromNumber, responseMsg,
        (err, _) => {
          if (err) throw abort(401, 'SMS delivery failed');
        }
      );
    }
    return _processedSms;
  })
  .then((_processedSms) => {
    // Update SMS process state
    const updatedSms = {
      user: _processedSms.user,
      processed: true,
      tsProcessed: Date.now(),
      responseMsg,
    };
    const option = {
      new: true,
    };
    SmsRequest.findByIdAndUpdate(
      _processedSms._id,
      updatedSms,
      option,
      (err, _updatedSms) => {
        if (err) throw abort(401, 'SMS process update failed');
        /* eslint-disable no-console */
        if (process.env.NODE_ENV !== 'test') {
          console.log('SMS is processed', _updatedSms);
        }
        /* eslint-enable no-console */
        return res.json({ status: 200, message: 'success', response: _updatedSms.responseMsg });
      });
  })
  .catch(err => next(err));
});

module.exports = router;
