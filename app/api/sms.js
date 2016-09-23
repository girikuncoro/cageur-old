// const router = require('express').Router();
// const SmsRequest = require('../model/sms-request');
// const nexmo = require('../config/sms');
//
//
// // Callback from inbound Nexmo SMS
// router.get('/nexmo', (req, res) => {
//   const newSms = new SmsRequest({
//     nexmoMessageId: req.query.messageId,
//     fromNumber: req.query.to,
//     toNumber: req.query.msisdn,
//     text: req.query.text,
//   });
//
//   // Store SMS for auditing
//   newSms.save().then(
//     (sms) => {
//       /* eslint-disable no-console */
//       console.log('Inbound Nexmo SMS stored', sms);
//       /* eslint-enable no-console */
//     },
//     (err) => { return next(err); }
//   );
//
//   // TODO: Load application data associated with SMS
//
//   // TODO: Load response from proper command routing
//   // Right now it's just copying back your input
//   const responseMsg = newSms.text;
//
//   if (responseMsg) {
//     nexmo.message.sendSms(
//       newSms.fromNumber, newSms.toNumber, responseMsg,
//       (err, _) => {
//         if (err) { return next(err); }
//       }
//     );
//   }
//
//   // TODO: Update SMS process state
//
//   res.json({ status: 200, message: responseMsg });
// });
//
// module.exports = router;
