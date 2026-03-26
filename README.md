# Solar Scraper

Solar Scraper is a Node.js application that scrapes solar usage data from a solar inverter API and posts the data to a Home Assistant instance.

## Installation

To install the dependencies, run:

```bash
yarn install
```

## Configuration
Before running the application, you need to configure the following environment variables:

SOLAR_API_URL: The URL of the solar inverter API.
SOLAR_API_KEY: The API key for the solar inverter API.
HOME_ASSISTANT_URL: The URL of the Home Assistant instance.
HOME_ASSISTANT_TOKEN: The access token for the Home Assistant instance.
You can set these environment variables in a .env file in the root directory of the project.

## Usage
To run the application, run:
```bash
yarn start
```

The application will scrape solar usage data from the API and post the data to the Home Assistant instance every 5 minutes.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
This project is licensed under the MIT License.