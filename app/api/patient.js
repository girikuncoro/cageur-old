const router = require('express').Router();
const Patient = require('../model/patient');

// Get patient by id
router.get('/id/:id', (req, res) => {
  Patient.findOne({ _id: req.params.id }).then(
    (patient) => {
      if (patient) {
        res.json({ status: 200, message: 'success', patient });
      } else {
        res.json({ status: 404, message: 'patient not found' });
      }
    },
    (err) => {
      /* eslint-disable no-console */
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'patient not found' });
    });
});

// Get patient by phone number
router.get('/phone/:phoneNumber', (req, res) => {
  Patient.findOne({ phoneNumber: req.params.phoneNumber }).then(
    (patient) => {
      if (patient) {
        res.json({ status: 200, message: 'success', patient });
      } else {
        res.json({ status: 404, message: 'patient not found' });
      }
    },
    (err) => {
      /* eslint-disable no-console */
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'patient not found' });
    });
});

module.exports = router;
