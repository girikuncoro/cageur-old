const router = require('express').Router();
const Patient = require('../model/patient');


// Insert new patient
router.post('/', (req, res) => {
  const newPatient = new Patient({
    phoneNumber: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    diseases: req.body.diseases,
  });

  Patient.find({ phoneNumber: newPatient.phoneNumber }).count().then(
    (exist) => {
      if (exist) {
        res.json({ status: 400, message: 'phone number exist' });
      } else {
        newPatient.save().then(
          (patient) => {
            res.json({ status: 200, message: 'success', patient });
          },
          (err) => {
            /* eslint-disable no-console */
            if (process.env.NODE_ENV !== 'test') {
              console.error(err);
            }
            /* eslint-enable no-console */
            res.json({ status: 401, message: 'missing required field for patient' });
          }
        );
      }
    }
  );
});

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
