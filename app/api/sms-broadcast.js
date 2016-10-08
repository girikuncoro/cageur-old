const router = require('express').Router();
const User = require('../model/user');
const abort = require('../util').abort;
const telerivet = require('../config/sms-telerivet');

// Broadcast SMS by phoneNumber
// /api/v1/sms/broadcast
router.post('/', (req, res, next) => {
  const phoneNumbers = req.body.phoneNumbers;
  const message = req.body.message;

  telerivet.sendMessages({
    content: message,
    to_numbers: phoneNumbers,
  }, (err, _) => {
    if (err) return next(abort(401, 'SMS delivery failed'));
    return res.json({
      status: 200,
      message: 'success',
      totalPatient: phoneNumbers.length,
      text: message,
    });
  });
});

// Broadcast SMS by disease group
// /api/v1/sms/broadcast/group
router.post('/group', (req, res, next) => {
  const group = req.body.group.trim().toLowerCase();
  const message = req.body.message;

  /* eslint-disable no-console */
  if (process.env.NODE_ENV !== 'test') {
    console.log('Message broadcasted', req);
  }
  /* eslint-enable no-console */

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

module.exports = router;
