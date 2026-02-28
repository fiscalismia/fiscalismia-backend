require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const isDemo = process.env.NODE_ENV === 'demo';
const PUBLIC_FRONTEND_DOMAIN = 'fiscalismia.com';
const PUBLIC_DEMO_FRONTEND_DOMAIN = 'demo.fiscalismia.com';
const PUBLIC_BACKEND_DOMAIN = 'backend.fiscalismia.com';
const PUBLIC_DEMO_BACKEND_DOMAIN = 'backend.demo.fiscalismia.com';
const S3_PRESIGNED_URL_TIMEOUT = 5000; // milliseconds
const LOCAL_INVOCATION_BASE_URL = 'http://127.0.0.1:3002';
const AWS_API_GATEWAY_ENDPOINT = 'https://4c9puhe7j8.execute-api.eu-central-1.amazonaws.com';
// port is either defined in .env file, or overwritten as podman build argument
// in production it is hardcoded to be https
const PROTOCOL = `${isProd ? 'https' : isDemo ? 'https' : 'http'}`;
const DOMAIN = isProd
  ? PUBLIC_BACKEND_DOMAIN
  : isDemo
    ? PUBLIC_DEMO_BACKEND_DOMAIN
    : process.env.HOST_ADDRESS
      ? process.env.HOST_ADDRESS
      : 'localhost';
const BACKEND_PORT = isDemo ? 8443 : isProd ? 443 : process.env.BACKEND_PORT;
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `${PROTOCOL}://${DOMAIN}:${BACKEND_PORT}${API_ADDRESS}`;
const ROOT_URL = `${PROTOCOL}://${DOMAIN}:${BACKEND_PORT}`;
const RATE_LIMIT_MULTIPLICATOR = process.env.NODE_ENV === 'test' ? 1000 : 1; // GLOBAL MODIFIER INCREASING RATE LIMIT REQUESTS
module.exports = {
  PUBLIC_FRONTEND_DOMAIN,
  PUBLIC_DEMO_FRONTEND_DOMAIN,
  BACKEND_PORT,
  ROOT_URL,
  API_ADDRESS,
  SERVER_ADDRESS,
  RATE_LIMIT_MULTIPLICATOR,
  AWS_API_GATEWAY_ENDPOINT,
  S3_PRESIGNED_URL_TIMEOUT,
  LOCAL_INVOCATION_BASE_URL
};
