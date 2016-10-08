const router = require('express').Router();
const abort = require('../util').abort;
const api = require('./telerivet-api');
const SmsOut = require('../model/sms-out');

const agent = require('superagent');
const async = require('async');

// Schedule SMS
// /api/v1/sms/schedule
router.post('/', (req, res, next) => {
  const sms = new SmsOut({
    groupId: req.body.groupId,
    message: req.body.message,
    timeSchedules: req.body.timeSchedules,
    frequency: req.body.frequency,
    timeStart: req.body.timeStart,
    clinicId: process.env.TELERIVET_PROJ_ID,
  });

  if (sms.frequency === 'once') {
    const payload = {
      content: sms.message,
      group_id: sms.groupId,
      start_time: sms.timeStart,
    };

    agent.post(api.scheduled)
    .send(payload)
    .auth(process.env.TELERIVET_API_KEY, '')
    .end((err, data) => {
      if (err) {
        return next(abort(400, 'Message scheduling failed', err));
      }
      const response = data.body;
      return res.json({
        status: 200,
        message: 'success',
        response,
      });
    });
  }

  if (sms.frequency === 'daily' || sms.frequency === 'monthly') {
    const response = [];
    const dailyOrMonthly = sms.frequency.toUpperCase();

    async.each(sms.timeSchedules, (schedule) => {
      const payload = {
        content: sms.message,
        group_id: sms.groupId,
        start_time: schedule,
        rrule: `FREQ=${dailyOrMonthly}`,
      };

      agent.post(api.scheduled)
      .send(payload)
      .auth(process.env.TELERIVET_API_KEY, '')
      .end((err, data) => {
        if (err) {
          return next(abort(400, 'Message scheduling failed', err));
        }
        response.push(data.body);

        if (response.length === sms.timeSchedules.length) {
          return res.json({
            status: 200,
            message: 'success',
            response,
          });
        }
        return null;
      });
    });
  }
});

module.exports = router;
