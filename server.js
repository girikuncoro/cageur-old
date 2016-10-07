/**
 * Module dependencies.
 */
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/**
 * Create express server.
 */
const app = express();

/**
 * Load env variables
 */
const env = process.env.NODE_ENV;
if (env === 'development' || env === 'test') {
  dotenv.load();
}

/**
 * Express configuration.
 */
const port = env === 'test' ? 3000 : process.env.PORT || 5000;
app.use(bodyParser.json()); // Enable json body parsing of application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/**
 * Primary app routes.
 */
app.get('/', (req, res) => {
  res.sendStatus(200);
});

/**
 * API routes.
 */
app.use('/api/v1/user', require('./app/api/user'));
app.use('/api/v1/sms/incoming', require('./app/api/sms-incoming'));
app.use('/api/v1/sms/broadcast', require('./app/api/sms-broadcast'));

/**
 * Error handler routes.
 */
app.use((err, _, res, __) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: 'error',
    error: err.message,
  });
});

/**
 * Start Express server.
 */
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`${env.toUpperCase()} server is now working on port ${port}...`);
  /* eslint-enable no-console */
});

module.exports = app;
