const router = require('express').Router();
const Patient = require('../model/patient');

// Get patient by id
router.get('/id/:id', (req, res) => {
  Patient.findOne({ _id: req.params.id }).then(
    (patient) => {
      if (patient) {
        res.json({ status: 200, message: 'success', patient });
      }
    },
    (err) => {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'patient not found' });
    });
});

module.exports = router;
