const unauthenticatedRoutes = require('express').Router();
const { loginWithUserCredentials } = require('../controllers/create_postgresController');
const { createUserCredentialsAndSchema } = require('../controllers/create_postgresUserSchema');
const { getIpAddress, healthCheck, databaseHealthCheck } = require('../controllers/read_postgresController');
const { getFoodItemImg } = require('../controllers/multerController');
const { unauthenticatedRateLimiter, imageRetrievalRateLimiter } = require('../middleware/rateLimiter'); // 👈 Import limiters

/**
 * Contains the only routes served to non-authenticated users.
 * Serves the purpose of logging in with existing credentials or signing up, creating new credentials.
 */

unauthenticatedRoutes.post('/um/login', unauthenticatedRateLimiter, loginWithUserCredentials);
unauthenticatedRoutes.post('/um/credentials', unauthenticatedRateLimiter, createUserCredentialsAndSchema);
unauthenticatedRoutes.get('/ip', getIpAddress);
unauthenticatedRoutes.get('/hc', healthCheck);
unauthenticatedRoutes.get('/db_hc', databaseHealthCheck);

/**
 * The Image is queried not via axios but via an url in the src location within the html page
 * And thus no authentication is sent with it.
 */
unauthenticatedRoutes.get('/public/img/uploads/:filepath', imageRetrievalRateLimiter, getFoodItemImg);

module.exports = unauthenticatedRoutes;
