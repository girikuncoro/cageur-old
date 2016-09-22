/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Create express server.
 */
const app = express();

/**
 * Express configuration.
 */
const env = process.env.NODE_ENV;
const port = env === 'test' ? 3000 : process.env.PORT || 5000;
app.use(bodyParser.json()); // Enable json body parsing of application/json
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get('/', (req, res) => {
  res.sendStatus(200);
});

/**
 * API routes.
 */
app.use('/api/v1/patient', require('./app/api/patient'));
app.use('/api/v1/sms', require('./app/api/sms'));

/**
 * Start Express server.
 */
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`${env.toUpperCase()} server is now working on port ${port}...`);
  /* eslint-enable no-console */
});

module.exports = app;
