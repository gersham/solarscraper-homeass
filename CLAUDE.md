# CLAUDE.md

## Project overview

Node.js app that scrapes solar inverter data from a cloud API and pushes it to Home Assistant. Polls every 5 minutes.

## Architecture

- **solarpower.js** — entry point. Calls fetchData then postSolarDataToHass on a 300s interval.
- **config.js** — loads `.env` via dotenv, exports API URLs, login credentials, and HA connection info.
- **solar.js** — authenticates with the cloud API (OAuth2 password grant), fetches three endpoints (flow, realtime, consumption), merges the data. Handles token refresh on 401.
- **exportToHA.js** — takes the merged solar data object and POSTs each sensor to Home Assistant's REST API. Contains the entity mapping and unit/device_class logic.

## Key details

- The plant ID (124649) is hardcoded in the API URLs in `config.js`.
- Network outage detection: if `updateAt` in the API response is >10 minutes old, `networkOutage` is set to true and all power sensors are zeroed.
- Token management is in-memory only (no persistence). The app re-authenticates on startup and refreshes on 401.
- Uses `node-fetch` is NOT used here — this project uses `axios`.
- `solar.js` exports `fetchData` twice in module.exports (duplicate key, harmless but redundant).

## Development

```bash
npm install
cp .env.example .env  # fill in real values
node solarpower.js
```

No tests. No build step.

## Secrets

All secrets live in `.env` (gitignored). Never commit credentials. The `.env.example` file documents the required variables.
