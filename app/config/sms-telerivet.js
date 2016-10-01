const telerivet = require('telerivet');

const tr = new telerivet.API(process.env.TELERIVET_API_KEY);
const project = tr.initProjectById(process.env.TELERIVET_PROJ_ID);

module.exports = project;
