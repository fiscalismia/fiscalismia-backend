const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
import { Request, Response } from 'express';
const { logSqlStatement } = require('../utils/SQL_UTILS');
const { pool } = require('../utils/pgDbService');

/***
 *    ______ _   _ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    | ___ \ | | |_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |_/ / | | | | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    |  __/| | | | | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |   | |_| | | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    \_|    \___/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test request using PUT to update the description field of test_table returning the new name
 * @method HTTP PUT
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/:id
 */
const updateTestData = asyncHandler(async (request: Request, response: Response) => {
  logger.http('update_postgresController received PUT to /api/fiscalismia/' + request.params.id);
  const sql = 'UPDATE test_table SET description = $1 WHERE id = $2 RETURNING description';
  const parameters = [request.body.description, request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result?.rows ? result.rows : null };
    if (result.rowCount > 0) {
      response.status(200).json(results);
    } else {
      response.status(204).json({ results: `id ${request.params.id} not found. Nothing has been updated` });
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. test_table could not be updated. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description PUT to update the price and last_update field of table_food_prices returning
 * @method HTTP PUT
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item/price/:id
 */
const updateFoodItemPrice = asyncHandler(async (request: Request, response: Response) => {
  logger.http('update_postgresController received PUT to /api/fiscalismia/food_item/price/' + request.params.id);
  const query =
    'UPDATE table_food_prices SET price = $1, last_update = $2 WHERE dimension_key = $3 RETURNING dimension_key as id, price::double precision';
  const parameters = [request.body.price, request.body.lastUpdate, request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(query, parameters);
    const result = await client.query(query, parameters);
    await client.query('COMMIT');
    const results = { results: result?.rows ? result.rows : null };
    if (result.rowCount > 0) {
      logger.info(
        'Successfully updated food item price of row with id: ' +
          result.rows[0].id +
          ' to ' +
          result.rows[0].price +
          '€'
      );
      response.status(200).json(results);
    } else {
      response.status(204).json({ results: `id ${request.params.id} not found. Nothing has been updated` });
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. relation could not be updated. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  updateTestData,
  updateFoodItemPrice
};
