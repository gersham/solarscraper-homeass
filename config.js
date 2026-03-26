require('dotenv').config();

module.exports = {
    authUrl: 'https://api.solarkcloud.com/oauth/token',
    flowDataURL: 'https://api.solarkcloud.com/api/v1/plant/energy/124649/flow',
    usageDataURL: 'https://api.solarkcloud.com/api/v1/plant/124649/realtime?id=124649',
    consumptionDataURL: 'https://api.solarkcloud.com/api/v1/plant/energy/124649/generation/use',
    logindata: {
      username: process.env.SOLARK_USERNAME,
      password: process.env.SOLARK_PASSWORD,
      grant_type: 'password',
      client_id: 'csp-web'
    },
    homeAssToken: process.env.HA_TOKEN,
    homeAssUrl: process.env.HA_URL || 'http://10.3.103.91:8123',
  };
