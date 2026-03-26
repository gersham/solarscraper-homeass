const axios = require('axios');
const { authUrl, flowDataURL, usageDataURL, consumptionDataURL, logindata } = require('./config.js');

let accessToken;
let refreshToken;

// Authenticate with the API
async function authenticate() {
    try {
        // Get access token
        const response = await axios.post(authUrl, logindata);
        accessToken = response.data.data.access_token;
        refreshToken = response.data.data.refresh_token;

        console.log('Authenticated successfully:', accessToken);

    } catch (error) {
        console.error('Error during authentication:', error);
        // exit the app
        process.exit(1);
    }
}

// Fetch data from the API
async function fetchData() {

    // check if we have an access token, if not, authenticate
    if (accessToken === undefined) {
        await authenticate();
    }

    // Build the current date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
  
    try {
      // Do Three Requests to the API
      const req1 = await axios.get(`${flowDataURL}?date=${currentDate}`, { headers }); // flow data
      let r1data = req1.data.data;
      const req2 = await axios.get(usageDataURL, { headers }); // usage data
      let r2data = req2.data.data;
      const req3 = await axios.get(consumptionDataURL, { headers }); // consumption data
      let r3data = req3.data.data;

      // merge r1data and r2data
      let solarData = { ...r1data, ...r2data, ...r3data };
      

      // Check for outage, the updateAt will be more than 10 minutes old
      // Ex: updateAt: '2025-01-13T02:14:37Z'
      const updateAt = new Date(solarData.updateAt);
      const now = new Date();
      const diffTime = Math.abs(now - updateAt);
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      if (diffMinutes > 10) {
        solarData.networkOutage = true;
      } else {
        solarData.networkOutage = false;
      }

      return solarData;

    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired, refresh it
        console.log('Access token expired, refreshing it...');
        accessToken =  undefined;
        await refreshAccessToken();
        return await fetchData();
      
      } else {
        console.error('Error fetching data:', error);
        return null;
      }
    }
  }

// Refresh the access token
async function refreshAccessToken() {
    const refreshData = {
        "refresh_token": refreshToken,
        "grant_type": "refresh_token",
        "client_id": "csp-web"
    };

    try {
        // Send a POST request to refresh the access token
        const response = await axios.post(authUrl, refreshData);
        accessToken = response.data.data.access_token;
        refreshToken = response.data.data.refresh_token;

    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

module.exports = {
    authenticate,
    fetchData,
    refreshAccessToken,
  };