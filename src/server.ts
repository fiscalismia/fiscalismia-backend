import { app, config } from './app';
const logger = require('./utils/logger');

app.listen(process.env.BACKEND_PORT, () => {
  logger.http(`${process.env.CLOUD_DB !== 'true' ? 'Docker ' : 'Cloud Hosted '}Postgres DB running ${process.env.CLOUD_DB !== 'true' ? `on ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}` : 'in [neon.tech cloud]'}
Server is listening at address: \r\n${config.SERVER_ADDRESS} `);
});
