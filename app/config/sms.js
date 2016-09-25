const Nexmo = require('nexmo');

const nexmoPhone = {
  ID: process.env.NEXMO_ID_PHONE,
  US: process.env.NEXMO_US_PHONE,
};

let nexmo;

if (process.env.NODE_ENV === 'staging') {
  nexmo = new Nexmo({
    apiKey: process.env.STAGE_NEXMO_API_KEY,
    apiSecret: process.env.STAGE_NEXMO_API_SECRET,
  });
}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  nexmo = new Nexmo({
    apiKey: process.env.DEV_NEXMO_API_KEY,
    apiSecret: process.env.DEV_NEXMO_API_SECRET,
  });
}

module.exports = { nexmo, nexmoPhone };
