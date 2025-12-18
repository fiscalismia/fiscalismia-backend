// Database Connection
const { Pool } = require('pg');
const types = require('pg').types;
require('dotenv').config();

/**
 * node-postgres converts DATE and TIMESTAMP columns into the local time of the node process
 * and this node process is offset by 2 hours, resulting in a date 1 day before the db-date
 * this requires overriding the date-parsing mechanism of node and providing string values as output
 * The type id can be found in the file: node_modules/pg-types/lib/textParsers.js
 * See: https://node-postgres.com/features/types
 */
types.setTypeParser(1114, function (stringValue: string) {
  return stringValue; //1114 for time without timezone type
});
types.setTypeParser(1082, function (stringValue: string) {
  return stringValue; //1082 for date type
});
/**
 * PG Integers are 64bit(INT8), while javascript numbers are only 32bit(INT4), that's why node-postgres interprets numeric
 * datatypes as strings. If we can confidently assume that numbers in the database never exceed 32bit, we can override this type conversion.
 */
types.setTypeParser(20, function (val: string) {
  return parseInt(val, 10); //20 for INT8
});
types.setTypeParser(1700, function (val: string) {
  return parseInt(val, 10); //1700 for numeric
});
/**
 * 1) When running the build in production, a cloud postgres instance is required to run on process.env.DB_CONNECTION_URL
 * 2) when running development on localhost or when running supertest tests from the console the postgres docker db can be reached via localhost
 * 3) when running development from within a docker container, the host cannot be localhost, as a bridge network in docker does not expose the localhost to individual containers
 *    For this purpose, the internal docker network resolves other docker containers via DNS by their container-name.
 *    This name is defined in the docker-compose file for the postgres service and derived from process.env.POSTGRES_HOST
 */
/* eslint-disable indent */
const pool =
  process.env.CLOUD_DB !== 'true' // docker dev & test db
    ? new Pool({
        user: process.env.POSTGRES_USER,
        host:
          process.env.NODE_ENV === 'docker-development' || process.env.NODE_ENV === 'demo'
            ? process.env.POSTGRES_HOST
            : 'localhost',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
        ssl: false
      })
    : // prod cloud db
      new Pool({
        connectionString: process.env.DB_CONNECTION_URL,
        ssl: true
      });

module.exports = { pool };
