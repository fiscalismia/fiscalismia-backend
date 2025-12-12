require('dotenv').config();

const isNonProd = process.env.NODE_ENV !== 'production';
const PUBLIC_DOMAIN = 'fiscalismia.com';
const PUBLIC_DEMO_DOMAIN = 'demo.fiscalismia.com';
// port is either defined in .env file, or overwritten as podman build argument
// in production it is hardcoded to be https
const BACKEND_PORT = isNonProd ? process.env.BACKEND_PORT : 443;
const API_ADDRESS = '/api/fiscalismia';
const PROTOCOL = `${isNonProd ? 'http' : 'https'}`;
const SERVER_ADDRESS = `${PROTOCOL}://${process.env.HOST_ADDRESS ? process.env.HOST_ADDRESS : 'localhost'}:${BACKEND_PORT}${API_ADDRESS}`;
const ROOT_URL = `${PROTOCOL}://${process.env.HOST_ADDRESS}:${BACKEND_PORT}`;
const RATE_LIMIT_MULTIPLICATOR = 1.0; // GLOBAL MODIFIER INCREASING RATE LIMIT REQUESTS
module.exports = {
  PUBLIC_DOMAIN,
  PUBLIC_DEMO_DOMAIN,
  BACKEND_PORT,
  ROOT_URL,
  API_ADDRESS,
  SERVER_ADDRESS,
  RATE_LIMIT_MULTIPLICATOR
};
