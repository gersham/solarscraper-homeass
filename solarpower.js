#!/usr/bin/env node

const solar = require('./solar');
const exportToHA = require('./exportToHA');

async function fetchDataAndPostToHass() {
    try {
      const solarData = await solar.fetchData();
      await exportToHA.postSolarDataToHass(solarData);
    } catch (error) {
      console.error(error);
    }
}
  
// Call fetchDataAndPostToHass() immediately on startup
fetchDataAndPostToHass();

// Call fetchDataAndPostToHass() every 300 seconds
setInterval(fetchDataAndPostToHass, 300000);