/* eslint-disable no-console */
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
const port = process.env.NODE_ENV === 'test' ? 3000 : process.env.PORT || 5000;
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

/**
 * Start Express server.
 */
app.listen(port, () => {
  console.log(`Dev server is now working on port ${port}...`);
});

module.exports = app;
