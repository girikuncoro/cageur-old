const router = require('express').Router();
const User = require('../model/user');


// Insert new user
router.post('/', (req, res) => {
  const newUser = new User({
    phoneNumber: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    diseases: req.body.diseases,
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
            if (process.env.NODE_ENV === 'dev') {
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

// Get user by id
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
      if (process.env.NODE_ENV === 'dev') {
        console.error(err);
      }
      /* eslint-enable no-console */
      res.json({ status: 404, message: 'user not found' });
    });
});

module.exports = router;
