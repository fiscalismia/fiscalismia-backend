const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
import { User } from '../utils/customTypes';

require('dotenv').config();

/**
 * generates a token encrypted via secret key to store a users' id
 * @param {*} user a user object containing userId, userName, userEmail and userSchema extracted from the database table um_users
 * @returns the signed json web token with an expiration date
 */
const generateToken = (user: User) => {
  logger.info('security.js received request to generate jsonwebtoken');
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === 'production';
  const token = jwt.sign({ user }, secret, { expiresIn: isProd ? '1h' : '1w' });
  return token;
};
module.exports = { generateToken };
