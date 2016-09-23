const router = require('express').Router();
const SmsRequest = require('../model/sms-request');
const User = require('../model/patient'); // TODO: refactor this to user model
const nexmo = require('../config/sms');


// Callback from inbound Nexmo SMS
router.get('/nexmo', (req, res, next) => {
  const newSms = new SmsRequest({
    nexmoMessageId: req.query.messageId,
    fromNumber: req.query.to,
    toNumber: req.query.msisdn,
    text: req.query.text,
  });

  // Store SMS for auditing
  newSms.save().then(
    (sms) => {
      /* eslint-disable no-console */
      console.log('Inbound Nexmo SMS stored', sms);
      /* eslint-enable no-console */
    },
    err => next(err)
  );

  // Load application data associated with SMS
  let userId;

  User.findOne({ phoneNumber: newSms.phoneNumber }).then(
    (user) => {
      userId = user._id;
    },
    err => next(err)
  );

  // TODO: Load response from proper command routing
  // Right now it's just copying back your input
  const responseMsg = newSms.text;

  if (responseMsg) {
    nexmo.message.sendSms(
      newSms.fromNumber, newSms.toNumber, responseMsg,
      (err, _) => {
        if (err) next(err);
      }
    );
  }

  // Update SMS process state
  SmsRequest.update(newSms, {
    user: userId,
    processed: true,
    tsProcessed: Date.now(),
  },
    (err, _) => {
      if (err) next(err);
      res.json({ status: 200, message: responseMsg });
    });
});

module.exports = router;
