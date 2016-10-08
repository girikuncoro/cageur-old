const router = require('express').Router();
const abort = require('../util').abort;
const api = require('./telerivet-api');

const Promise = require('bluebird');
const agent = require('superagent-promise')(require('superagent'), Promise);


// Get group of diseases
// /api/v1/group
router.get('/', (req, res, next) => {
  agent.get(api.group)
  .auth(process.env.TELERIVET_API_KEY, '')
  .end()
  .then(
    (data) => {
      const response = data.body;
      if (response.length === 0) {
        return next(abort(404, 'Groups not exist'));
      }
      return res.json({
        status: 200,
        message: 'success',
        response,
      });
    },
    err => next(abort(400, 'Group query failed', err))
  );
});

module.exports = router;
