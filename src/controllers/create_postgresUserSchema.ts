const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const format = require('pg-format');
const { pool } = require('../utils/pgDbService');
import { Request, Response } from 'express';
import { regExAlphaNumeric, regExEmail, usernameRegExp, usuerSchemaRegExp } from '../utils/sharedFunctions';
import { ParameterizedQuery, PostgresError } from '../utils/customTypes';
const {
  buildInsertUmUsers,
  buildVerifyUsername,
  buildInitializeUserSettings,
  logSqlStatement,
  buildVerifyUserSchemaTableCount
} = require('../utils/SQL_UTILS');

/**
 * @description expects a application/json request.body containing username and password keys
 * destined for INSERTION into encrypted credential storage within database
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/credentials
 */
const createUserCredentialsAndSchema = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/um/credentials');
  const credentials = {
    username: request.body.username?.toLowerCase(),
    email: request.body.email,
    password: request.body.password
  };
  if (!credentials.username || !credentials.password || !credentials.email) {
    logger.debug('username, email or password not provided in request.body');
    response.status(400); // Bad Request
    throw new Error('username, email and/or password missing in POST request');
  }
  if (!usernameRegExp.test(credentials.username)) {
    logger.debug(`username ${credentials.username} fails regular expression test. ${usernameRegExp}`);
    response.status(422); // Unprocessable Content
    throw new Error(
      'username must conform to the latin alphabet! Allowed are 3-32 alphanumerical Chracters and underscores'
    );
  }
  if (!regExEmail.test(credentials.email)) {
    logger.debug(`email did not match the chromium email regex pattern ${regExEmail}`);
    response.status(422); // Unprocessable Content
    throw new Error('email must conform to the Chromium email standard such as example_1@domain.xyz!');
  }
  if (!regExAlphaNumeric.test(credentials.password)) {
    logger.debug(`password did not match the alphanumeric regex pattern ${regExAlphaNumeric}`);
    response.status(422); // Unprocessable Content
    throw new Error('password must contain alphanumeric characters, hyphens or underscores only!');
  }
  const userSchemaToInsert = `private_${credentials.username.toLowerCase()}`;
  if (!usuerSchemaRegExp.test(userSchemaToInsert)) {
    logger.debug(
      `lowercase username appended to 'private_' did not match the alphanumeric regex pattern ${usuerSchemaRegExp}`
    );
    response.status(422); // Unprocessable Content
    throw new Error(
      'username must conform to the latin alphabet! Allowed are 3-32 alphanumerical Chracters and underscores!'
    );
  }
  const client = await pool.connect();
  const queryInsertCredentials: ParameterizedQuery = buildInsertUmUsers(credentials, userSchemaToInsert);
  const queryVerifyCredentials: ParameterizedQuery = buildVerifyUsername(credentials);
  const queryReceiveUserSchemaTableCount: ParameterizedQuery = buildVerifyUserSchemaTableCount(userSchemaToInsert);
  const queryInsertSettingsForNewUser: ParameterizedQuery = buildInitializeUserSettings(credentials);
  // we do not call the public ddl script, as this should only run once on database initialization
  // const ddlPublicTemplate = fs.readFileSync(path.join(__dirname, '../../database/pgsql-public-ddl.sql'), 'utf8');
  const ddlUserTemplate = fs.readFileSync(path.join(__dirname, '../../database/pgsql-user-ddl.sql'), 'utf8');
  const dmlTemplate = fs.readFileSync(path.join(__dirname, '../../database/pgsql-demo-dml.sql'), 'utf8');
  try {
    await client.query('BEGIN');
    logSqlStatement(queryInsertCredentials.text, ['CREDENTIALS HIDDEN']);
    await client.query(queryInsertCredentials.text, queryInsertCredentials.values);
    logSqlStatement(queryInsertSettingsForNewUser.text, queryInsertSettingsForNewUser.values);
    await client.query(queryInsertSettingsForNewUser);
    logSqlStatement(queryVerifyCredentials.text, ['CREDENTIALS HIDDEN']);
    const result = await client.query(queryVerifyCredentials);
    const results = { results: result ? result.rows : null };
    const userSchema = result?.rows[0]?.userschema;
    const userName = result?.rows[0]?.username;
    if (result.rowCount != 1) {
      throw new Error('user could not be uniquely identified');
    }
    if (!userName || userName !== credentials.username) {
      throw new Error('username provided does not match username in database');
    }
    if (!userSchema || userSchema !== userSchemaToInsert) {
      throw new Error(`userschema does not match private_${credentials.username.toLowerCase()} in database`);
    }
    // CREATE USER SCHEMA
    await client.query(format('CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION fiscalismia_api', userSchema));
    await client.query(format('GRANT ALL ON SCHEMA %I TO fiscalismia_api', userSchema));
    await client.query(format('SET search_path TO %I', userSchema));
    logger.info(`User Schema ${userSchema} created and set as search_path for user [${userName}]`);

    // EXECUTE DDL STATEMENTS TO INIT DB
    await client.query(ddlUserTemplate);

    if (process.env.NODE_ENV !== 'production') {
      // INIT WITH DEMO DATA FOR NONPROD
      await client.query(dmlTemplate);
      logger.info(`Populated schema [${userSchema}] for user [${credentials.username}] with demo data.`);
    }
    logSqlStatement(queryReceiveUserSchemaTableCount.text, queryReceiveUserSchemaTableCount.values);
    const userSchemaTableCount = await client.query(queryReceiveUserSchemaTableCount);
    if (userSchemaTableCount.rows && userSchemaTableCount.rows.length > 0 && userSchemaTableCount.rows[0].table_count) {
      logger.info(
        `Created #${userSchemaTableCount.rows[0].table_count} tables in [${userSchema}] for user [${credentials.username}]`
      );
    }
    await client.query('COMMIT');
    response.status(201).send(results);
    logger.info(`User [${credentials.username}] successfully created`);
  } catch (error: unknown) {
    await client.query('ROLLBACK');

    // Type guard to check if it's a PostgresError with the FK code
    const isUniqueConstraintViolation = (e: any): e is PostgresError => {
      return e && e.code === '23505';
    };

    if (isUniqueConstraintViolation(error)) {
      const errorMsg = `Unique constraint violation: ${error.detail}.`;
      logger.warn(errorMsg);
      response.status(409).json({
        errorMsg: errorMsg
      });
    } else {
      response.status(500);
    }
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK: user credentials could not be stored in the database. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = { createUserCredentialsAndSchema };
