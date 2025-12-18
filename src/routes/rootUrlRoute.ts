const rootUrlRoute = require('express').Router();
const { getRootUrlResponse } = require('../controllers/read_postgresController');
const { rootUrlRateLimiter } = require('../middleware/rateLimiter');

rootUrlRoute.get('/', rootUrlRateLimiter, getRootUrlResponse);

module.exports = rootUrlRoute;
