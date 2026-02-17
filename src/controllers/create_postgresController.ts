import {
  FixedCosts,
  FixedIncome,
  FoodItem,
  InvestmentAndTaxes,
  StagingVariableBills,
  UserSettingObject
} from '../utils/customTypes';
import { Request, Response } from 'express';
import { usernameRegExp } from '../utils/sharedFunctions';
import axios from 'axios';

const {
  replaceCommaAndParseFloat,
  extractResultHeaders,
  headersAsExpected,
  parseHeader
} = require('../utils/sharedFunctions');

const config = require('../utils/config');
const asyncHandler = require('express-async-handler');
const { parse } = require('csv-parse/sync');
const logger = require('../utils/logger');
const format = require('pg-format');
const { pool } = require('../utils/pgDbService');
const {
  buildInsertStagingVariableBills,
  buildInsertFixedCosts,
  buildInsertFixedIncome,
  buildInsertInvestments,
  buildInsertNewFoodItems,
  buildVerifyUsername,
  logSqlStatement,
  insertIntoTestTable,
  insertIntoUserSettings,
  insertIntoFoodItemDiscount,
  insertNewFoodItemIntoFoodPrices,
  insertIntoInvestments,
  insertIntoInvestmentDividends,
  insertIntoInvestmentTaxes,
  insertIntoBridgeInvestmentDividends
} = require('../utils/SQL_UTILS');
const { generateToken } = require('../utils/security');

/**
 *    ______ _____ _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    | ___ \  _  /  ___|_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |_/ / | | \ `--.  | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    |  __/| | | |`--. \ | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |   \ \_/ /\__/ / | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    \_|    \___/\____/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test query posting data into test_table
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/
 */
const postTestData = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/');
  const parameters = [request.body.description];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(insertIntoTestTable, parameters);
    const result = await client.query(insertIntoTestTable, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description user settings for UPSERT statement of public.um_user_settings
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/settings
 */
const postUpdatedUserSettings = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/upload/um/settings');

  const userSettingObj: UserSettingObject = request.body;
  const parameters = [userSettingObj.username, userSettingObj.settingKey, userSettingObj.settingValue];
  if (!usernameRegExp.test(userSettingObj.username)) {
    logger.debug(`username ${userSettingObj.username} fails regular expression test. ${usernameRegExp}`);
    response.status(422); // Unprocessable Content
    throw new Error(
      'username must conform to the latin alphabet! Allowed are 3-32 alphanumerical Chracters and underscores'
    );
  }
  if (
    userSettingObj.settingKey === 'selected_mode' ||
    userSettingObj.settingKey === 'selected_language' ||
    userSettingObj.settingKey === 'selected_palette'
  ) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      logSqlStatement(insertIntoUserSettings, parameters);
      const result = await client.query(insertIntoUserSettings, parameters);
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      response.status(400);
      if (error instanceof Error) {
        error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
      }
      throw error;
    } finally {
      client.release();
    }
  } else {
    logger.debug(`${userSettingObj.settingKey} not in predefined list of expected values`);
    response.status(400);
    throw new Error('setting key is not valid. please refrain from posting it again.');
  }
});

/**
 * @description food item discount information object validated and added via frontend
 * contains the following fields:
 * id | price | startDate | endDate
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item_discount
 */
const postFoodItemDiscount = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/food_item_discount');
  const discountInfo = request.body;
  const parameters = [discountInfo.id, discountInfo.price, discountInfo.startDate, discountInfo.endDate];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(insertIntoFoodItemDiscount, parameters);
    const result = await client.query(insertIntoFoodItemDiscount, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description food item information object validated and added via frontend
 * contains the following fields:
 * food_item | brand | store | main_macro | kcal_amount | weight | price | last_update
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item
 */
const postNewFoodItem = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/food_item');
  const newFoodItem = request.body;
  const parameters = [
    newFoodItem.food_item,
    newFoodItem.brand,
    newFoodItem.store,
    newFoodItem.main_macro,
    newFoodItem.kcal_amount,
    newFoodItem.weight,
    newFoodItem.price,
    newFoodItem.last_update
  ];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(insertNewFoodItemIntoFoodPrices, parameters);
    const result = await client.query(insertNewFoodItemIntoFoodPrices, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description INSERTING investment and taxes information object validated and added via frontend
 * contains the following fields:
 * execution_type, description, isin, investment_type, marketplace, units, price_per_unit, total_price, fees, execution_date, pct_of_profit_taxed, profit_amt
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investments
 */
const postInvestmentAndTaxes = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/investments');
  const sqlTaxes = insertIntoInvestmentTaxes('investment');
  const investmentAndTaxesObject = request.body;
  const parametersInvestments = [
    investmentAndTaxesObject.execution_type,
    investmentAndTaxesObject.description,
    investmentAndTaxesObject.isin,
    investmentAndTaxesObject.investment_type,
    investmentAndTaxesObject.marketplace,
    investmentAndTaxesObject.units,
    investmentAndTaxesObject.price_per_unit,
    investmentAndTaxesObject.total_price,
    investmentAndTaxesObject.fees,
    investmentAndTaxesObject.execution_date
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(insertIntoInvestments, parametersInvestments);
    const result = await client.query(insertIntoInvestments, parametersInvestments);
    if (investmentAndTaxesObject.execution_type === 'sell' && result?.rows[0]?.id && result.rows[0].id > 0) {
      if (investmentAndTaxesObject.pct_of_profit_taxed === null || investmentAndTaxesObject.profit_amt === null) {
        const errorMessage = 'For Investment Sales pct_of_profit_taxed & profit_amt columns have to be defined';
        throw new Error(errorMessage);
      }
      const parametersTaxes =
        investmentAndTaxesObject.execution_type === 'sell'
          ? [
              result.rows[0].id,
              investmentAndTaxesObject.pct_of_profit_taxed,
              investmentAndTaxesObject.profit_amt,
              (
                ((Number(investmentAndTaxesObject.profit_amt) * Number(investmentAndTaxesObject.pct_of_profit_taxed)) /
                  100) *
                Number(0.26375)
              ).toFixed(2),
              new Date(investmentAndTaxesObject.execution_date).getFullYear()
            ]
          : null;
      // INVESTMENT IS A SALE (with Tax Information) && INSERT INVESTMENTS RETURNED SUCCESSFULLY
      logSqlStatement(sqlTaxes, parametersTaxes);
      const taxesResult = await client.query(sqlTaxes, parametersTaxes);
      await client.query('COMMIT');
      const results = {
        results: result ? result.rows : null,
        taxesResults: taxesResult ? taxesResult.rows : null
      };
      response.status(201).send(results);
    } else {
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description INSERTING dividends and taxes information object validated and added via frontend
 * contains the following fields:
 * isin, dividendAmount, dividendDate, pctOfProfitTaxed, profitAmount
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment_dividends
 */
const postDividendsAndTaxes = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/investment_dividends');
  const dividendObject = request.body;
  const parametersDividends = [dividendObject.isin, dividendObject.dividendAmount, dividendObject.dividendDate];
  const sqlTaxes = insertIntoInvestmentTaxes('dividend');
  let parametersTaxes;
  let parametersBridge: any[][];

  if (!dividendObject.investmentIdsAndRemainingUnits || dividendObject.investmentIdsAndRemainingUnits.length === 0) {
    // Dividend is related to 1-n investments which are either fully or partially owned
    throw new Error('Dividend could not be associated with any owned investments. INSERT denied.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    //   __            __   ___       __     ___       __        ___
    //  |  \ | \  / | |  \ |__  |\ | |  \     |   /\  |__) |    |__
    //  |__/ |  \/  | |__/ |___ | \| |__/     |  /~~\ |__) |___ |___

    logSqlStatement(insertIntoInvestmentDividends, parametersDividends);
    const result = await client.query(insertIntoInvestmentDividends, parametersDividends);
    // INVESTMENT IS A SALE (with Tax Information) && INSERT INVESTMENTS RETURNED SUCCESSFULLY
    if (result?.rows[0]?.id && result.rows[0].id > 0) {
      // ___           ___  __     ___       __        ___
      //  |   /\  \_/ |__  /__`     |   /\  |__) |    |__
      //  |  /~~\ / \ |___ .__/     |  /~~\ |__) |___ |___
      parametersTaxes = [
        result.rows[0].id,
        dividendObject.pctOfProfitTaxed,
        dividendObject.profitAmount,
        (
          ((Number(dividendObject.profitAmount) * Number(dividendObject.pctOfProfitTaxed)) / 100) *
          Number(0.26375)
        ).toFixed(2),
        new Date(dividendObject.dividendDate).getFullYear()
      ];
      logSqlStatement(sqlTaxes, parametersTaxes);
      const taxesResult = await client.query(sqlTaxes, parametersTaxes);
      //   __            __   ___       __      __   __     __   __   ___
      //  |  \ | \  / | |  \ |__  |\ | |  \    |__) |__) | |  \ / _` |__
      //  |__/ |  \/  | |__/ |___ | \| |__/    |__) |  \ | |__/ \__> |___
      let bridgeResult: any;
      parametersBridge = [];
      dividendObject.investmentIdsAndRemainingUnits.forEach((e: { investmentId: number; remainingUnits: number }) => {
        parametersBridge.push([e.investmentId, result.rows[0].id, e.remainingUnits]);
      });
      try {
        /**
         * pg-format takes a value array and constructs multiple insert statements to be executed in one transaction.
         * syntax: format('INSERT INTO test_table (id, name) VALUES %L', valueArray)
         */
        const promiseResult = await new Promise((resolve, reject) => {
          logSqlStatement(insertIntoBridgeInvestmentDividends, parametersBridge);
          client.query(
            format(insertIntoBridgeInvestmentDividends, parametersBridge),
            [],
            (error: unknown, result: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });
        bridgeResult = promiseResult;
      } catch (error: unknown) {
        const errorMessage = `INSERT INTO bridge_investment_dividends has encountered an error: ${(error as Error).message}`;
        throw new Error(errorMessage);
      }
      await client.query('COMMIT');
      const results = {
        results: result ? result.rows : null,
        taxesResults: taxesResult ? taxesResult.rows : null,
        bridgeResults: bridgeResult ? bridgeResult.rows : null
      };
      response.status(201).send(results);
    } else {
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});
/**   ___ _________  ________ _   _    ___  ______ _____  ___
 *   / _ \|  _  \  \/  |_   _| \ | |  / _ \ | ___ \  ___|/ _ \
 *  / /_\ \ | | | .  . | | | |  \| | / /_\ \| |_/ / |__ / /_\ \
 *  |  _  | | | | |\/| | | | | . ` | |  _  ||    /|  __||  _  |
 *  | | | | |/ /| |  | |_| |_| |\  | | | | || |\ \| |___| | | |
 *  \_| |_/___/ \_|  |_/\___/\_| \_/ \_| |_/\_| \_\____/\_| |_/
 */
/**
 * @description Triggers automated serverless RAW ETL process, hitting AWS API Gateway Route,
 * which then Invokes Raw_Data_ETL Lambda function, pulling google sheet document, which is then
 * transformed to distinct TSV files for PSQL Statement generation by the backend's own routes.
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/admin/raw_data_etl
 */
const postRawDataEtlInvocation = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/admin/raw_data_etl');
  try {
    if (!process.env.API_GW_SECRET_KEY) {
      response.status(500).json({ error: 'Missing Secret Key for API Gateway' });
    }
    console.log('HELLO');
    const apiResponse = await axios.post(
      `${config.AWS_API_GATEWAY_ENDPOINT}/api/fiscalismia/post/raw_data_etl/invoke_lambda/return_tsv_file_urls`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.API_GW_SECRET_KEY
        },
        timeout: 30000
      }
    );
    console.log('HELLO TOO');
    logger.debug(JSON.stringify(apiResponse));
    response.status(202).send('API Gateway invoked successfully');
  } catch (error: unknown) {
    console.log(error);
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/** _____ _____  _   _      _____ _   _  _____ ___________ _____ _____
 * |_   _/  ___|| | | |    |_   _| \ | |/  ___|  ___| ___ \_   _/  ___|
 *   | | \ `--. | | | |      | | |  \| |\ `--.| |__ | |_/ / | | \ `--.
 *   | |  `--. \| | | |      | | | . ` | `--. \  __||    /  | |  `--. \
 *   | | /\__/ /\ \_/ /     _| |_| |\  |/\__/ / |___| |\ \  | | /\__/ /
 *   \_/ \____/  \___/      \___/\_| \_/\____/\____/\_| \_| \_/ \____/
 */

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description,  category,  store, cost,  purchasing_date,  is_planned,  contains_indulgence, sensitivities
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/variable_expenses
 */
const postVariableExpensesTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/variable_expenses');
  try {
    const expectedColumns = [
      'description',
      'category',
      'store',
      'cost',
      'purchasing_date',
      'is_planned',
      'contains_indulgence',
      'sensitivities'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'cost') {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: StagingVariableBills) => {
      const insertRow = buildInsertStagingVariableBills(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_costs
 * @returns INSERT INTO statements in response
 */
const postFixedCostsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/fixed_costs');
  try {
    const expectedColumns = [
      'category',
      'description',
      'monthly_interval',
      'billed_cost',
      'monthly_cost',
      'effective_date',
      'expiration_date'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (
          context.column === 'monthly_interval' ||
          context.column === 'billed_cost' ||
          context.column === 'monthly_cost'
        ) {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FixedCosts) => {
      const insertRow = buildInsertFixedCosts(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_income
 * @returns INSERT INTO statements in response
 */
const postIncomeTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/fixed_income');
  try {
    const expectedColumns = ['description', 'type', 'monthly_interval', 'value', 'effective_date', 'expiration_date'];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'monthly_interval' || context.column === 'value') {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FixedIncome) => {
      const insertRow = buildInsertFixedIncome(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * IF EXECUTION_TYPE IS SELL IT EXPECTS 2 MORE COLUMNS TO BE FILLED AND WILL GENERATE ANOTHER INSERT INTO STATEMENT FOR investment_taxes
 * MANDATORY HEADER STRUCTURE:
 * execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date, pct_of_profit_taxed, profit_amt
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/investments
 * @returns INSERT INTO statements in response
 */
const postInvestmentsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/investments');
  try {
    const expectedColumns = [
      'execution_type',
      'description',
      'isin',
      'investment_type',
      'marketplace',
      'units',
      'price_per_unit',
      'total_price',
      'fees',
      'execution_date',
      'pct_of_profit_taxed',
      'profit_amt'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (
          context.column === 'price_per_unit' ||
          context.column === 'total_price' ||
          context.column === 'fees' ||
          context.column === 'profit_amt' ||
          context.column === 'pct_of_profit_taxed'
        ) {
          return replaceCommaAndParseFloat(value);
        } else if (context.column === 'units') {
          return parseInt(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: InvestmentAndTaxes) => {
      const insertRow = buildInsertInvestments(e);
      insertStatements = insertStatements.concat(insertRow);
      if (e.execution_type === 'sell') {
        if (e.pct_of_profit_taxed === null || e.profit_amt === null) {
          const errorMessage = 'For Investment Sales pct_of_profit_taxed & profit_amt columns have to be defined';
          throw new Error(errorMessage);
        }
        // CREATES 2 INSERT INTO STATEMENTS FOR SALES TO CONSIDER TAXES
        insertCount += 2;
      } else {
        insertCount++;
      }
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/new_food_items
 * @returns INSERT INTO statements in response
 */
const postNewFoodItemsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/new_food_items');
  try {
    const expectedColumns = [
      'food_item',
      'brand',
      'store',
      'main_macro',
      'kcal_amount',
      'weight',
      'price',
      'last_update'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'price') {
          return replaceCommaAndParseFloat(value);
        } else if (context.column === 'kcal_amount' || context.column === 'weight') {
          return parseInt(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FoodItem) => {
      const insertRow = buildInsertNewFoodItems(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description expects a application/json request.body containing username and password keys
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/login
 */
const loginWithUserCredentials = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/um/login');
  const credentials = {
    username: request.body.username,
    password: request.body.password
  };
  if (!credentials.username || !credentials.password) {
    response.status(400);
    throw new Error('username and/or password not provided in request.body');
  }
  const client = await pool.connect();
  const sqlSetSearchPathToPublic = 'SET search_path TO "public"';
  const sql = buildVerifyUsername(credentials);
  const parameters = '';
  try {
    logSqlStatement(sql, parameters);
    await client.query(sqlSetSearchPathToPublic);
    const result = await client.query(sql, parameters);
    if (result.rowCount != 1) {
      response.status(400);
      throw new Error(`Login failed. SELECT to verify user credentials returns rowcount of [${result.rowCount}]`);
    }
    const results = { rows: result ? result.rows : null };
    if (results.rows[0]?.username && results.rows[0]?.username !== credentials.username) {
      response.status(400);
      throw new Error('Login failed. username from request.body and database query do not match');
    }
    const user = {
      userId: results.rows[0]?.userid,
      userName: results.rows[0]?.username,
      userEmail: results.rows[0]?.useremail,
      userSchema: results.rows[0]?.userschema
    };
    const jwtToken = generateToken(user);
    response.status(200).send(jwtToken);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `Login failed. User could not be verified. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  postTestData,

  postFoodItemDiscount,
  postNewFoodItem,
  postInvestmentAndTaxes,
  postDividendsAndTaxes,

  postNewFoodItemsTextTsv,
  postInvestmentsTextTsv,
  postVariableExpensesTextTsv,
  postFixedCostsTextTsv,
  postIncomeTextTsv,
  postRawDataEtlInvocation,

  loginWithUserCredentials,
  postUpdatedUserSettings
};
