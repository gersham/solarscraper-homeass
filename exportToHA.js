// this should export a data structure to homeassistant
const axios = require('axios');
const { homeAssToken, homeAssUrl } = require('./config');

const HASS_URL = homeAssUrl;
const ACCESS_TOKEN = homeAssToken;

async function postSolarDataToHass(data) {
    console.log('Posting data to Home Assistant...');
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    };

    // Flow Entities Initialization
    const entities = {
        'sensor.solar_soc': data['soc'] || 0,
    };

    // Check for Network Outage
    if (data['networkOutage']) {
        // Our network is down, set all the power entities to 0
        entities['sensor.network_outage'] = true;
        entities['sensor.solar_grid_power_from'] = 0;
        entities['sensor.solar_grid_power_to'] = 0;
        entities['sensor.solar_batt_power_from'] = 0;
        entities['sensor.solar_batt_power_to'] = 0;
        entities['sensor.solar_gen_power'] = 0;
        entities['sensor.solar_load_power'] = 0;
        entities['sensor.solar_pv_power'] = 0;

    } else {
        entities['sensor.network_outage'] = false;

        // Battery Power Entities
        if (data['battPower'] === undefined || data['battPower'] === null || data['battPower'] === 0) { 
            entities['sensor.solar_batt_power_from'] = 0;
            entities['sensor.solar_batt_power_to'] = 0;
        } else if (data['toBat']) {
            entities['sensor.solar_batt_power_from'] = 0;
            entities['sensor.solar_batt_power_to'] = data['battPower'];
        } else {
            entities['sensor.solar_batt_power_to'] = 0;
            entities['sensor.solar_batt_power_from'] = data['battPower'];
        }

        // Grid Power Entities
        if (data['gridOrMeterPower'] === undefined || data['gridOrMeterPower'] === null || data['gridOrMeterPower'] === 0) { 
            entities['sensor.solar_grid_power_from'] = 0;
            entities['sensor.solar_grid_power_to'] = 0;
        } else if (data['toGrid']) {
            entities['sensor.solar_grid_power_to'] = data['gridOrMeterPower'];
            entities['sensor.solar_grid_power_from'] = 0;
        } else {
            entities['sensor.solar_grid_power_to'] = 0;
            entities['sensor.solar_grid_power_from'] = data['gridOrMeterPower'];
        }

        // Flow Entities
        entities['sensor.solar_gen_power'] = data['genPower'] || 0;
        entities['sensor.solar_load_power'] = data['loadOrEpsPower'] || 0;
        entities['sensor.solar_pv_power'] = data['pvPower'] || 0;
    }

    // Consumption Entities
    entities['sensor.solar_consumed_to_load'] = data['load'] || 0;
    entities['sensor.solar_consumed_to_grid'] = data['gridSell'] || 0;
    entities['sensor.solar_consumed_to_battery'] = data['batteryCharge'] || 0;
    entities['sensor.solar_consumed_from_pv'] = data['pv'] || 0;

    // Loop through each entity and update the corresponding Home Assistant sensor
    for (const [entity, value] of Object.entries(entities)) {
        
        // Common Properties for all entities
        let updates = {
            state: value,
            attributes: {
                unit_of_measurement: 'W',
                device_class: 'power',
                state_class: 'measurement',
            }
        };

        if (entity === "sensor.solar_soc") {
            // If the entity is the solar state of charge sensor, set the attributes accordingly
            updates.attributes.unit_of_measurement = '%';
            updates.attributes.device_class = 'battery';
        } else if (entity === 'sensor.solar_generated_efficiency') {
            // If the entity is the solar generated efficiency sensor, set the attributes accordingly
            updates.attributes.unit_of_measurement = '%';
            updates.attributes.device_class = 'power_factor';
        } else if (entity.match(/sensor.solar_generated.*/) || entity.match(/sensor.solar_consumed.*/)) {
            // If the entity is a solar generated or consumed sensor, set the attributes accordingly
            updates.attributes.unit_of_measurement = 'kWh';
            updates.attributes.device_class = 'energy';
        } else if (entity === 'sensor.network_outage') {
            updates.state = !!value; // Ensure the state is explicitly a boolean
            delete updates.attributes.unit_of_measurement; // Remove unit_of_measurement for a boolean
            updates.attributes.device_class = 'problem'; // Use 'problem' as the device class
            delete updates.attributes.state_class; // Optional: Remove state_class if not needed
        }

        try {
            // Send a POST request to update the sensor in Home Assistant
            await axios.post(`${HASS_URL}/api/states/${entity}`, updates, { headers });
            const unitOfMeasurement = updates['attributes']['unit_of_measurement'] || '';
            console.log(`${entity} -> ${updates['state']} ${unitOfMeasurement}`);
        } catch (error) {
            console.error(`Error posting data to ${entity} in Home Assistant:`, error);
        }
    }}

// export postSolarDataToHass
module.exports = {
    postSolarDataToHass
};