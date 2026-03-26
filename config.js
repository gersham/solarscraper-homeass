require('dotenv').config();

const plantId = process.env.PLANT_ID;

module.exports = {
    authUrl: 'https://api.solarkcloud.com/oauth/token',
    flowDataURL: `https://api.solarkcloud.com/api/v1/plant/energy/${plantId}/flow`,
    usageDataURL: `https://api.solarkcloud.com/api/v1/plant/${plantId}/realtime?id=${plantId}`,
    consumptionDataURL: `https://api.solarkcloud.com/api/v1/plant/energy/${plantId}/generation/use`,
    logindata: {
      username: process.env.SOLARK_USERNAME,
      password: process.env.SOLARK_PASSWORD,
      grant_type: 'password',
      client_id: 'csp-web'
    },
    homeAssToken: process.env.HA_TOKEN,
    homeAssUrl: process.env.HA_URL || 'http://10.3.103.91:8123',
  };
