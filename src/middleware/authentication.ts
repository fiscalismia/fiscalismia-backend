const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const { buildFindUserById,logSqlStatement } = require('../utils/SQL_UTILS');
require('dotenv').config();
const { pool } = require('../utils/pgDbService');
import { Request, Response } from 'express';
import { ParameterizedQuery } from '../utils/customTypes';

/**
 * Middleware for user authentication of protected routes
 * 1) reads the authorization header starting with String 'Bearer ' and extracts jsonwebtoken
 * 2) the jwt is then verified with the same secret used for signing and the userId extracted
 * 3) the database is queried for this userId
 * 4) the request is assigned the variables userName, userEmail and userId and next() called
 */
const authenticateUser = asyncHandler(async (request: Request, response: Response, next: any) => {
  logger.debug(
    'authentication.ts received request to verify jsonwebtoken and set request header values [userName] [userEmail] and [userId]'
  );
  let token;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    const client = await pool.connect();
    try {
      token = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = decodedToken?.user;
      const query : ParameterizedQuery = buildFindUserById(user?.userId);
      logSqlStatement(query.text, query.values);
      const result = await client.query(query);
      if (result.rowCount != 1) {
        response.status(401);
        throw new Error(
          `Authentication via token failed. SELECT to find user by id returns rowcount of [${result.rowCount}]`
        );
      }
      const results = { rows: result ? result.rows : null };
      if (results.rows[0].userid && results.rows[0].userid !== decodedToken.user.userId) {
        response.status(401);
        throw new Error('Authentication via token failed. id from decoded token and database query do not match');
      }
      request.userId = results.rows[0].userid;
      request.userName = results.rows[0].username;
      request.userEmail = results.rows[0].useremail;
      request.userSchema = results.rows[0].userschema;
      logger.info(
        `User [${request.userName}] /w email [${request.userEmail}'] successfully authenticated /w userId [${request.userId}] using db schema [${request.userSchema}]'`
      );
      next();
    } catch (error: unknown) {
      response.status(401);
      if (error instanceof Error) {
        error.message = `User not authenticated with provided token. ${error.message}`;
      }
      throw error;
    } finally {
      client.release();
    }
  }
  if (!token) {
    response.status(401).send('User not authenticated due to missing token.');
  }
});

module.exports = { authenticateUser };
