const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
require('dotenv').config({ path: '/run/secrets/.env' });
const { pool } = require('../utils/pgDbService');
const format = require('pg-format');
import { Request, Response } from 'express';

/**
 * Middleware for extracting user Schema from authenticated user JWT Token
 */
const addUserSchemaToSearchPath = asyncHandler(async (request: Request, response: Response, next: any) => {
  logger.debug(
    'userSchemaInit.ts received request to extract userSchema from authenticated jwt token and set to pgsql search_path.'
  );
  let token;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    const client = await pool.connect();
    try {
      token = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userName = decodedToken?.user?.userName;
      const userSchema = decodedToken?.user?.userSchema;
      if (!userSchema || userSchema.length <= 0) {
        response.status(500);
        throw new Error('UserSchema could not be extracted from authenticated jwt token payload.');
      }
      await client.query(format('SET search_path TO "public", "%I" ', userSchema));
      logger.info(`PostgreSQL search_path set to [${userSchema}] for User [${userName}]'`);
      next();
    } catch (error: unknown) {
      response.status(500);
      if (error instanceof Error) {
        error.message = `Search Path could not be set. ${error.message}`;
      }
      throw error;
    } finally {
      client.release();
    }
  }
});

module.exports = { addUserSchemaToSearchPath };
