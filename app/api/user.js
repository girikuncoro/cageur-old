const router = require('express').Router();
const User = require('../model/user');
const abort = require('../util').abort;


// Insert new user
// /api/v1/user
router.post('/', (req, res) => {
  const newUser = new User({
    phoneNumber: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    diseases: req.body.diseases,
    clinic: req.body.clinic,
  });

  User.find({ phoneNumber: newUser.phoneNumber }).count().then(
    (exist) => {
      if (exist) {
        res.json({ status: 400, message: 'phone number exist' });
      } else {
        newUser.save().then(
          (user) => {
            res.json({ status: 200, message: 'success', user });
          },
          (err) => {
            /* eslint-disable no-console */
            if (process.env.NODE_ENV === 'development') {
              console.error(err);
            }
            /* eslint-enable no-console */
            res.json({ status: 401, message: 'missing required field for user' });
          }
        );
      }
    }
  );
});

// Get all users
// /api/v1/user
router.get('/', (req, res, next) => {
  User.find({})
  .then((patients) => {
    if (patients.length === 0) {
      throw abort(404, 'Patient data is empty');
    }
    return res.json({ status: 200, message: 'success', patients });
  })
  .catch(err => next(err));
});

// Get user by id
// /api/v1/user/id
router.get('/id/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then(
    (user) => {
      if (user) {
        res.json({ status: 200, message: 'success', user });
      } else {
        res.json({ status: 404, message: 'user not found' });
      }
    },
    (err) => {
      /* eslint-disable no-console */
      if (process.env.NODE_ENV === 'dev') {
        console.error(err);
      }
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'user not found' });
    });
});

// Get user by phone number
// /api/v1/user/phone
router.get('/phone/:phoneNumber', (req, res) => {
  User.findOne({ phoneNumber: req.params.phoneNumber }).then(
    (user) => {
      if (user) {
        res.json({ status: 200, message: 'success', user });
      } else {
        res.json({ status: 404, message: 'user not found' });
      }
    },
    (err) => {
      /* eslint-disable no-console */
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'user not found' });
    });
});

module.exports = router;
