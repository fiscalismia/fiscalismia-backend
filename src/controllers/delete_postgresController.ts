const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { PostgresError } from '../utils/customTypes';
const { getLocalTimestamp } = require('../utils/sharedFunctions');
const {
  deleteFoodItemById,
  deleteFoodItemDiscountByIdAndStartDate,
  logSqlStatement,
  deleteInvestmentById,
  deleteInvestmentTaxById,
  deleteDividendFromBridgeById,
  deleteDividendById,
  truncateUserSchemaTables
} = require('../utils/SQL_UTILS');

const { pool } = require('../utils/pgDbService');

/***
 *    ______ _____ _      _____ _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    |  _  \  ___| |    |  ___|_   _|  ___|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | | | | |__ | |    | |__   | | | |__     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    | | | |  __|| |    |  __|  | | |  __|    |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |/ /| |___| |____| |___  | | | |___    | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    |___/ \____/\_____/\____/  \_/ \____/    \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test request using DELETE to delete the row with :id from test_table
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/:id
 */
const deleteTestData = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /api/fiscalismia/' + request.params.id);
  const sql = 'DELETE FROM test_table  WHERE id = $1 RETURNING id';
  const parameters = [request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(200).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(500);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from test_table. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete 1-n rows with dimension_key == :dimension_key from table_food_prices
 * IS CASCADED TO DISCOUNTS VIA TRIGGER FUNCTION delete_food_item_discount_trigger_function()
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item/:dimension_key
 */
const deleteFoodItem = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'delete_postgresController received DELETE to /api/fiscalismia/food_item/' + request.params.dimension_key
  );
  const parameters = [request.params.dimension_key];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(deleteFoodItemById, parameters);
    const result = await client.query(deleteFoodItemById, parameters);
    const results = { results: result ? result.rows : null };
    if (result?.rows?.length > 0) {
      result.rows.forEach((e: any) => {
        logger.info('Successfully deleted food item with id: [' + e.id + ']');
      });
      await client.query('COMMIT');
      response.status(200).send(results);
    } else {
      throw new Error('DELETE Food Item SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(500);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from table_food_prices. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete the row with supplied food_prices_dimension_key discount_start_date from food_price_discounts
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item_discount/:food_prices_dimension_key/:discount_start_date
 */
const deleteFoodItemDiscount = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'delete_postgresController received DELETE to /api/fiscalismia/food_item_discount/' +
      request.params.food_prices_dimension_key +
      '/' +
      request.params.discount_start_date
  );
  const parameters = [request.params.food_prices_dimension_key, request.params.discount_start_date];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(deleteFoodItemDiscountByIdAndStartDate, parameters);
    const result = await client.query(deleteFoodItemDiscountByIdAndStartDate, parameters);
    const results = { results: result ? result.rows : null };
    if (result?.rows?.length > 0) {
      result.rows.forEach((e: any) => {
        logger.info('Successfully deleted food item discount with id: [' + e.id + ']');
      });
      await client.query('COMMIT');
      response.status(200).send(results);
    } else {
      throw new Error('DELETE Food Item Discount SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(500);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from food_price_discounts. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete single row with id from investments
 * and conditionally delete single row from investment_taxes if execution_type is "sell"
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment/:id
 */
const deleteInvestment = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /api/fiscalismia/investment/' + request.params.id);
  const parameters = [request.params.id];
  const deleteInvestmentTaxSql = deleteInvestmentTaxById('investment');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // CONDITIONALLY DELETE TAXES ONLY FOR INVESTMENT SALES BECAUSE THEY SHOULD BE NULL FOR BUYS
    const checkExecutionTypeResult = await client.query('SELECT execution_type FROM investments WHERE id = $1', [
      request.params.id
    ]);
    if (checkExecutionTypeResult?.rows?.length > 0 && checkExecutionTypeResult.rows[0]?.execution_type === 'buy') {
      logger.debug('Execution Type of Investment to be deleted is "buy" - SKIPPING deletion of taxes.');
    } else {
      logSqlStatement(deleteInvestmentTaxSql, parameters);
      const deleteTaxesResult = await client.query(deleteInvestmentTaxSql, parameters);
      if (deleteTaxesResult?.rows?.length > 0 && deleteTaxesResult.rows[0]?.id > 0) {
        logger.info('Successfully deleted tax of investment with id: [' + deleteTaxesResult.rows[0].id + ']');
      } else {
        throw new Error('DELETE Taxes for Investment SQL has not returned the deleted id.');
      }
    }
    // DELETE INVESTMENTS BY ID UNCONDITIONALLY
    logSqlStatement(deleteInvestmentById, parameters);
    const deleteInvestmentResult = await client.query(deleteInvestmentById, parameters);
    if (deleteInvestmentResult?.rows?.length > 0 && deleteInvestmentResult.rows[0]?.id > 0) {
      logger.info('Successfully deleted investment with id: [' + deleteInvestmentResult.rows[0].id + ']');
      await client.query('COMMIT');
      const results = { results: deleteInvestmentResult ? deleteInvestmentResult.rows : null };
      response.status(200).send(results);
    } else {
      throw new Error('DELETE Investment SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    // Type guard to check if it's a PostgresError with the FK code
    const isFkViolation = (e: any): e is PostgresError => {
      return e && e.code === '23503';
    };

    if (isFkViolation(error)) {
      const errorMsg = `FK violation: ${error.detail}.`;
      logger.warn(errorMsg);
      response.status(409).json({
        errorMsg: errorMsg
      });
    } else {
      response.status(500);
    }
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from investments. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete
 * 1) single row from investment_taxes
 * 2) 1-n rows from bridge_investment_dividends
 * 3) single row with id from investment_dividends
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment_dividend/:id
 */
const deleteInvestmentDividend = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /api/fiscalismia/investment_dividend/' + request.params.id);
  const parameters = [request.params.id];
  const deleteInvestmentTaxSql = deleteInvestmentTaxById('dividend');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // 1) DELETE SINGLE TAX ENTRY OF DIVIDEND BY ID
    logSqlStatement(deleteInvestmentTaxSql, parameters);
    const deleteTaxesResult = await client.query(deleteInvestmentTaxSql, parameters);
    if (deleteTaxesResult?.rows?.length > 0 && deleteTaxesResult.rows[0]?.id > 0) {
      logger.info('Successfully deleted tax of dividend with id: [' + deleteTaxesResult.rows[0].id + ']');
    } else {
      throw new Error('DELETE Taxes for Dividend SQL has not returned the deleted id.');
    }
    // 2) DELETE 1-n DIVIDEND ENTRIES FROM BRIDGE TO INVESTMENTS
    logSqlStatement(deleteDividendFromBridgeById, parameters);
    const deleteDividendBridgeEntryResult = await client.query(deleteDividendFromBridgeById, parameters);
    if (deleteDividendBridgeEntryResult?.rows?.length > 0) {
      deleteDividendBridgeEntryResult.rows.forEach((e: any) => {
        logger.info('Successfully deleted bridge entry for dividend with investment_id: [' + e.id + ']');
      });
    } else {
      throw new Error('DELETE Food Item Discount SQL has not returned the deleted id.');
    }
    // 3) DELETE SINGLE DIVIDEND BY ID
    logSqlStatement(deleteDividendById, parameters);
    const deleteInvestmentResult = await client.query(deleteDividendById, parameters);
    if (deleteInvestmentResult?.rows?.length > 0 && deleteInvestmentResult.rows[0]?.id > 0) {
      logger.info('Successfully deleted dividend with id: [' + deleteInvestmentResult.rows[0].id + ']');
      await client.query('COMMIT');
      const results = { results: deleteInvestmentResult ? deleteInvestmentResult.rows : null };
      response.status(200).send(results);
    } else {
      throw new Error('DELETE Dividend SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(500);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row(s) could not be deleted from investment_taxes|bridge_investment_dividends|investment_dividends. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to TRUNCATE the entire user schema table content,
 * essentially clearing the database and executing a reset for the user's data
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /admin/user_schema/truncate_all
 */
const truncateAllUserSchemaTables = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /admin/user_schema/truncate_all');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Verify we are deleting tables in the correct userschema
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userSchema = decodedToken?.user?.userSchema;
      const searchPathQuery = await client.query('SHOW search_path');
      const searchPathResult = searchPathQuery ? searchPathQuery.rows : null;
      if (
        searchPathResult &&
        searchPathResult.length > 0 &&
        searchPathResult[0].search_path &&
        searchPathResult[0].search_path.includes(userSchema)
      ) {
        logger.debug('search_path is set correctly. Proceeding with truncate operation');
      } else {
        throw new Error(`search_path is not set to ${userSchema}`);
      }
    } else {
      throw new Error('Bearer token could not be extracted to verify userSchema.');
    }
    const independentDeletion = await client.query(truncateUserSchemaTables);
    const independentDeletionResult = independentDeletion ? independentDeletion.rows : null;
    if (independentDeletionResult && independentDeletionResult.length > 0) {
      logger.debug('DELETION ROW COUNT: ' + JSON.stringify(independentDeletionResult[0]));
      response.status(200).json({ timestamp: getLocalTimestamp(), ...independentDeletionResult[0] });
    } else {
      throw new Error('DELETION of user schema tables did not succeed.');
    }
    await client.query('COMMIT');
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    // Type guard to check if it's a PostgresError with the FK code
    const isFkViolation = (e: any): e is PostgresError => {
      return e && e.code === '23503';
    };

    if (isFkViolation(error)) {
      const errorMsg = `FK violation: ${error.detail}.`;
      logger.warn(errorMsg);
      response.status(409).json({
        errorMsg: errorMsg
      });
    } else {
      response.status(500);
    }
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Database truncate of user schema encountered an error. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  deleteTestData,

  truncateAllUserSchemaTables,

  deleteFoodItem,
  deleteFoodItemDiscount,
  deleteInvestment,
  deleteInvestmentDividend
};
