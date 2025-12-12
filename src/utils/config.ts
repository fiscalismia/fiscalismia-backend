require('dotenv').config();

const PUBLIC_DOMAIN = 'fiscalismia.com';
const PUBLIC_DEMO_DOMAIN = 'demo.fiscalismia.com';
const BACKEND_PORT = process.env.BACKEND_PORT || 3004;
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.HOST_ADDRESS ? process.env.HOST_ADDRESS : 'localhost'}:${BACKEND_PORT}${API_ADDRESS}`;
const ROOT_URL = `http://${process.env.HOST_ADDRESS}:${BACKEND_PORT}`;
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
