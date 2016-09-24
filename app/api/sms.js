const router = require('express').Router();
const SmsRequest = require('../model/sms-request');
const User = require('../model/patient'); // TODO: refactor this to user model
const nexmo = require('../config/sms');

// Callback checker init for inbound Nexmo SMS
router.post('/nexmo', (req, res, next) => {
  return res.sendStatus(200);
});


// Callback from inbound Nexmo SMS
router.get('/nexmo', (req, res, next) => {
  const newSms = new SmsRequest({
    nexmoMessageId: req.query.messageId,
    fromNumber: req.query.to,
    toNumber: req.query.msisdn,
    text: req.query.text,
  });

  // Store SMS for auditing
  let processedSms;
  let responseMsg;

  newSms.save()
  .then((sms) => {
    processedSms = sms;
    /* eslint-disable no-console */
    console.log('Inbound Nexmo SMS stored', sms);
    /* eslint-enable no-console */
    return User.findOne({ phoneNumber: sms.toNumber });
  })
  .then((user) => {
    // Load application data associated with SMS
    if (!user) {
      throw new Error('SMS sender not found');
    }
    processedSms.user = user._id;
    return processedSms;
  })
  .then((_processedSms) => {
    // TODO: Load response from proper command routing
    // Right now it's just copying back your input
    responseMsg = _processedSms.text || 'Empty SMS response';
    nexmo.message.sendSms(
      newSms.fromNumber, newSms.toNumber, responseMsg,
      (err, _) => {
        if (err) throw new Error('SMS delivery failed');
      }
    );
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
        if (err) throw new Error('SMS process update failed');
        /* eslint-disable no-console */
        console.log('SMS is processed', _updatedSms);
        /* eslint-enable no-console */
        return res.json({ status: 200, message: _updatedSms.responseMsg });
      });
  })
  .catch(err => next(err));
});

module.exports = router;
