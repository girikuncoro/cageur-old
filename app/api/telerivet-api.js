const baseUrl = `https://api.telerivet.com/v1/projects/${process.env.TELERIVET_PROJ_ID}`;

const telerivetApi = {
  group: `${baseUrl}/groups`,
  scheduled: `${baseUrl}/scheduled`,
};

module.exports = telerivetApi;
