const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const os = require('os');
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
const config = require('../utils/config');
const { pool } = require('../utils/pgDbService');
const { getLocalTimestamp } = require('../utils/sharedFunctions');

/***
 *     _____  _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    |  __ \|  ___|_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |  \/| |__   | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    | | __ |  __|  | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |_\ \| |___  | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *     \____/\____/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test query fetching data from test_table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia
 */
const getTestData = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM test_table ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description root url returns some basic information about the application
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /
 */
const getRootUrlResponse = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to root url /');
  response.status(200).json({
    info: 'This is a REST API.',
    endpoint: '/api/fiscalismia/',
    health: '/api/fiscalismia/hc',
    whatismyip: '/api/fiscalismia/ip'
  });
});

/**
 * @description query to retrieve ip address behind proxies to help debug the correct value for
 * app.set('trust proxy', 1) in the server configuration for express-rate-limit
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/ip
 */
const getIpAddress = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/ip');
  response.json({ ip: request.ip });
});

/**
 * @description sends back status 200 and server information on health check
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/hc
 */
const healthCheck = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/hc');
  const serverUptime = Number((os.uptime() / 3600).toFixed(2));
  const nodeUptime = Number((process.uptime() / 3600).toFixed(2));
  const hostname = os.hostname();
  const platform = os.platform();
  const kernel = os.release();
  const machine = os.machine();
  const loadAvg = os.loadavg();
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(3);
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(3);
  response.status(200).send({
    status: 'OK',
    version: `${process.env.BACKEND_VERSION ? process.env.BACKEND_VERSION : 'local-development'}`,
    node_uptime_hours: nodeUptime,
    server_uptime_hours: serverUptime,
    hostname: hostname,
    platform: platform,
    machine: machine,
    kernel: kernel,
    loadAvg: loadAvg,
    freeMem: `${freeMem} GB`,
    totalMem: `${totalMem} GB`
  });
});

/**
 * @description sends back status 200 and database info extraced from postgres on db health check
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/db_hc
 */
const databaseHealthCheck = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/db_hc');
  const client = await pool.connect();
  const result = await client.query(`
    SELECT
      'OK' AS status,
      version() AS postgres_version,
      current_timestamp - pg_postmaster_start_time() AS up_time
  `);
  if (result.rows && result.rows.length > 0 && result.rows[0].postgres_version && result.rows[0].up_time) {
    response.status(200).send(result.rows[0]);
  } else {
    response.status(503).send({ status: 'Service Unavailable' });
  }
  client.release();
});

/**
 * @description sends boop back on beep
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/beep
 */
const boopResponse = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/beep');
  const highestHexValue = 3;
  const red1 = Math.floor(Math.random() * highestHexValue + 1);
  const red2 = Math.floor(Math.random() * highestHexValue + 1);
  const green1 = Math.floor(Math.random() * highestHexValue + 1);
  const green2 = Math.floor(Math.random() * highestHexValue + 1);
  const blue1 = 0;
  const blue2 = 0;
  const backgroundColor = `#${red1}${red2}${green1}${green2}${blue1}${blue2}`;
  const quotes = [
    'Smile! Life is hard, but at least you look cute',
    // eslint-disable-next-line quotes
    "Falling apart is just gravity's sense of humor",
    'Keep going… at least until the chocolate runs out',
    'We love the mooooooooooon 🌕',
    'Hup hup 🚆🚆',
    'You are the bear!',
    'You will be a boat captain some day ⛵'
  ];
  // animal emojis :3
  // https://www.w3schools.com/charsets/ref_emoji_animals.asp

  response.status(200).type('html').send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>beep → boop</title>
          <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: ${backgroundColor};
              color: #e5e7eb;
              font-family: Consolas, "Roboto Mono", Roboto, monospace;
            }
            .boop {
              font-size: 6rem;
              letter-spacing: 0.2em;
              text-shadow: 0 0 12px rgba(148, 163, 184, 0.35);
            }
            .sub {
              margin-top: 12px;
              padding-left: 15px;
              padding-right:10px;
              display: block;
              font-size: 2rem;
              letter-spacing: 0.1em;
              text-shadow: 0 0 6px rgba(148, 163, 184, 0.35);
            }
          </style>
        </head>
        <body>
          <div class="boop">🦫 boop 🐻</div>
          <div class="sub">${quotes[Math.floor(Math.random() * quotes.length)]}</div>
        </body>
      </html>
    `);
});

/**
 * @description query fetching all data from fixed_costs table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/settings/:username
 */
const getUserSpecificSettings = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/um/settings/' + request.params.username);
  const username = request.params.username;
  const client = await pool.connect();
  const result = await client.query(
    'SELECT setting_key, setting_value, setting_description FROM public.um_user_settings WHERE user_id = (SELECT id FROM public.um_users WHERE username = $1)',
    [username]
  );
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from category table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/category
 */
const getAllCategories = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/category');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM category ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from store table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/store
 */
const getAllStores = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/store');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM store ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from sensitivity table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivity
 */
const getAllSensisitivies = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/sensitivity');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM sensitivity ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from variable_expenses table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/variable_expenses
 */
const getAllVariableExpenses = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/variable_expenses');
  const client = await pool.connect();
  const result = await client.query(`
  SELECT
    exp.id, exp.description, category.description as category, store.description as store, cost::double precision, purchasing_date, is_planned, contains_indulgence,
    CASE WHEN contains_indulgence IS TRUE
    THEN STRING_AGG (sens.description,', ')
    ELSE NULL
    END as indulgences
  FROM variable_expenses exp
  JOIN category category ON category.id = exp.category_id
  JOIN store store ON store.id = exp.store_id
  LEFT OUTER JOIN bridge_var_exp_sensitivity exp_sens ON exp_sens.variable_expense_id = exp.id
  LEFT OUTER JOIN sensitivity sens ON exp_sens.sensitivity_id = sens.id
  GROUP BY exp.id, exp.description, category.description, store.description, cost, purchasing_date, is_planned, contains_indulgence
  ORDER BY purchasing_date desc
`);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from investments and investment_taxes table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investments
 */
const getAllInvestments = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/investments');
  const client = await pool.connect();
  const result = await client.query(`
  SELECT
    id, execution_type, description, isin, investment_type, marketplace, units, price_per_unit::double precision, total_price::double precision, fees::double precision, execution_date,
    pct_of_profit_taxed::double precision, profit_amt::double precision, tax_rate::double precision, tax_paid::double precision, tax_year
  FROM investments inv
  LEFT OUTER JOIN investment_taxes tax ON inv.id = tax.investment_id
  ORDER BY execution_date
  `);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from v_investment_dividends table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment_dividends
 */
const getAllDividends = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/investment_dividends');
  const client = await pool.connect();
  const result = await client.query(`
  SELECT
     *
   FROM v_investment_dividends
   ORDER BY id`);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from fixed_costs table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs
 */
const getAllFixedCosts = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/fixed_costs');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from fixed_income table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_income
 */
const getAllFixedIncome = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/fixed_income');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_income ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from v_food_price_overview
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_prices_and_discounts
 */
const getAllFoodPricesAndDiscounts = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/food_prices_and_discounts');
  const client = await pool.connect();
  const result = await client.query(`SELECT
  distinct id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  FROM v_food_price_overview
  WHERE current_date BETWEEN effective_date and expiration_date
  ORDER BY store, normalized_price`);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all discounted foods from v_food_price_overview
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/discounted_foods_current
 */
const getCurrentlyDiscountedFoodPriceInformation = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/discounted_foods_current');
  const client = await pool.connect();
  const result = await client.query(`SELECT
    id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date,
    discount_price, reduced_by_amount, reduced_by_pct, discount_start_date, discount_end_date, starts_in_days, ends_in_days,
    discount_days_duration, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  FROM v_food_price_overview
  WHERE discount_price IS NOT NULL AND discount_end_date >= current_date ORDER BY id`);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching all data from variable_expenses table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase
 */
const getAllSensitivitiesOfPurchase = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase');
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity ORDER BY id');
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from category table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/category/:id
 */
const getCategoryById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/category/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM category WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from store table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/store/:id
 */
const getStoreById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/store/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM store WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from sensitivity table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivity/:id
 */
const getSensitivityById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/sensitivity/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM sensitivity WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from variable_expenses table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/variable_expenses/:id
 */
const getVariableExpenseById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/variable_expenses/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM variable_expenses WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from variable_expenses table based on provided category such as 'Sale'
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/variable_expenses/category/:category
 */
const getVariableExpenseByCategory = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'read_postgresController received GET to /api/fiscalismia/variable_expenses/category/' + request.params.category
  );
  const id = request.params.category;
  const client = await pool.connect();
  const result = await client.query(
    `
    SELECT
      exp.id, exp.description, category.description as category, store.description as store, cost, purchasing_date, is_planned, contains_indulgence
    FROM variable_expenses exp
    JOIN category category ON category.id = exp.category_id AND category.description = $1
    JOIN store store ON store.id = exp.store_id
    ORDER BY purchasing_date desc
    `,
    [id]
  );
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from investments table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investments/:id
 */
const getInvestmentById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/investments/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM investments WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from investment_dividends table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment_dividends/:id
 */
const getInvestmentDividendsById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/investment_dividends/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM investment_dividends WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from fixed_costs table based on provided id
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs/:id
 */
const getFixedCostById = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/fixed_costs/' + request.params.id);
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs WHERE id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from fixed_costs table based on provided date
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs/valid/:date
 * @returns list of valid fixed costs at a specific provided date
 */
const getFixedCostsByEffectiveDate = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/fixed_costs/valid/' + request.params.date);
  const date = request.params.date;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs WHERE $1 BETWEEN effective_date AND expiration_date', [
    date
  ]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from fixed_income table based on provided date
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_income/valid/:date
 * @returns list of valid fixed income data at a specific provided date
 */
const getFixedIncomeByEffectiveDate = asyncHandler(async (request: Request, response: Response) => {
  logger.http('read_postgresController received GET to /api/fiscalismia/fixed_income/valid/' + request.params.date);
  const date = request.params.date;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_income WHERE $1 BETWEEN effective_date AND expiration_date', [
    date
  ]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from bridge_var_exp_sensitivity table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase/sensitivity/:id
 */
const getSensitivitiesOfPurchaseyBySensitivityId = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase/sensitivity/' +
      request.params.id
  );
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity WHERE sensitivity_id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});

/**
 * @description query fetching specific data from bridge_var_exp_sensitivity table
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase/var_expense/:id
 */
const getSensitivitiesOfPurchaseyByVarExpenseId = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase/var_expense/' +
      request.params.id
  );
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity WHERE variable_expense_id = $1', [id]);
  const results = { results: result ? result.rows : null };
  response.status(200).send(results);
  client.release();
});
/**   ___ _________  ________ _   _    ___  ______ _____  ___
 *   / _ \|  _  \  \/  |_   _| \ | |  / _ \ | ___ \  ___|/ _ \
 *  / /_\ \ | | | .  . | | | |  \| | / /_\ \| |_/ / |__ / /_\ \
 *  |  _  | | | | |\/| | | | | . ` | |  _  ||    /|  __||  _  |
 *  | | | | |/ /| |  | |_| |_| |\  | | | | || |\ \| |___| | | |
 *  \_| |_/___/ \_|  |_/\___/\_| \_/ \_| |_/\_| \_\____/\_| |_/
 */
/**
 * @description Triggers automated serverless RAW ETL process, hitting AWS API Gateway Route with POST,
 * which then Invokes Raw_Data_ETL Lambda function, pulling google sheet document, which is then
 * transformed to distinct TSV files uploaded to S3 and sent to backend as presigned urls,
 * the backend then uses this TSV data for PSQL Statement generation in the backend's own routes.
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/admin/raw_data_etl
 */
const getRawDataEtlInvocation = asyncHandler(async (_request: Request, response: Response) => {
  logger.http('create_postgresController received GET to /api/fiscalismia/admin/raw_data_etl');
  try {
    if (!process.env.API_GW_SECRET_KEY) {
      response.status(500).json({ error: 'Missing Secret Key for API Gateway' });
    }
    const requestEndpoint = `${config.AWS_API_GATEWAY_ENDPOINT}/api/fiscalismia/post/raw_data_etl/invoke_lambda/return_tsv_file_urls`;
    const requestBody = undefined;
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.API_GW_SECRET_KEY
      },
      timeout: 30000
    };
    logger.debug(`Invoking ${requestEndpoint} to start ETL...`);
    const gatewayResponse = await axios.post(requestEndpoint, requestBody, requestConfig);
    if (gatewayResponse?.status == 202 && gatewayResponse.data) {
      // downloading TSV files from s3 via pre-signed urls
      const sse_headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
      };
      response.set(sse_headers);
      response.flushHeaders(); // to establish connection with client
      let data;
      let message;
      if (gatewayResponse.data.presigned_urls && gatewayResponse.data.presigned_urls.length > 0) {
        message = `${getLocalTimestamp()}: \nAPI Gateway invoked successfully. \nDownloading TSV files from S3...`;
        data = `data: ${JSON.stringify({ message: message })}\n\n`;
        logger.debug(message);
        response.write(data);
        const s3Response = await axios.get(gatewayResponse.data.presigned_urls[0], {
          timeout: config.S3_PRESIGNED_URL_TIMEOUT
        });
        if (s3Response.data && s3Response.data.length > 0) {
          message = `${getLocalTimestamp()}: TSV payload retrieved successfully from S3.`;
          data = `data: ${JSON.stringify({ message: message })}\n\n`;
          logger.debug(message);
          response.write(data);
        } else {
          response.status(400);
          throw new Error('TSV download from S3 presigned_url failed');
        }
      } else {
        response.status(400);
        throw new Error('API Gateway response does not include s3 presigned_urls.');
      }
      /**
       * CLAUDE INSTRUCTIONS HERE: on successful invocation I expect an array of s3 presigned urls to be returned containing a link to a TSV file between 10-500 kilobytes.
       * I want to start an asynchronous background process that downloads this file into the backend express server's memory, or if more suitable temporary file.
       * The TSV payload should then be sent to the backend express server api on http://localhost:3002 to the route /api/fiscalismia/texttsv/fixed_costs and the tsv content should be sent in the body. .
       * {
        "presigned_urls": [
          "https://fiscalismia-raw-data-etl-storage.s3.amazonaws.com/transformed/2026-02-19_19-57-01-fixed_costs.tsv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQFC27LPN3R7BUIAI%2F20260219%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20260219T185709Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJIMEYCIQDfT9tqmtovF%2BKUJddxRJRaNuq%2B9FVB3jzsoMvCn9mmCQIhALC5Roxwy5Ngar3gClvit5NiRbAzAXGlH2HIbiw4pnzsKowDCIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMDEwOTI4MjE3MDUxIgxP33%2BIISr3s%2FiUxgoq4AKoLIMkWLPARCkIyFSMQC%2F5wkyIemaEKZUt1cWQWXC6OVnoELj7OqbwqXnLQBe%2FJ8fAguqrNpKUFHfDi9fXleI1qxyz4LZGzK%2FO1mSm17h2nAy4NOfRh4jv%2BWxGE0T3XGii%2BntIav1VAC1DavIMDPuNzQuPkjE8n83EkQEmRZ%2FGxBwiZym7vgcaei1t67vbKKZ4pecKkx2qpiynCjWMoB9Jiz8WRahLVIXXM6cWAuvWeY6QimKw2PQIUiXdM7BdZ9xgFX0721LExdYeChXUeRH6A0rz4p8CP%2Beyxhn%2BcO7USzQ9aw0Y%2B4EGQIi6pzUh1r%2BBqqwI28wOCRwj9w%2BShUHoJ3yoSvDJ7pJWXQ1kdOEGUcGAvHnJvBmUav12Wop7n%2FZptf5889GZGNlMtDmdRxNNGFjIcGEmTL%2FfDlNIIPTv3QokAbmnZ437uXmXav23nJu%2FjuUCBHgBNbxmiVgwFcszMPu53cwGOp0B%2FTrs%2Fvy34fb03YuH6r07fEJaUZURJ4%2BLGLHyYCUhhwf33tpC3NnlKrXrJvyLgAQ%2BxtS%2F7k7F2ueDb0X1bY83t1KrCHtatyWiQTwOk6QvDQdod7V1Ma2gyqPzKTb%2FhhaDNgDCAlZMEXOp03pZDj7KX5LopNHHoH%2FO3KpYp6zbEmaa78IxXxnwKBkMVtuYTBAHY5%2BoZBFRXz1N3X%2BN4w%3D%3D&X-Amz-Signature=4685c342859fe6101e911bfc5cbcce41cf800828563aa61868bfcec5a4708dd4",
        ]
      }
      */
      console.log(gatewayResponse.data);
    } else {
      response.status(400).json({
        message:
          'API Gateway invocation did not return expected data. Check Log Group /aws/lambda/Fiscalismia_RawDataETL'
      });
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = error.response?.data?.message ?? error.message;

      logger.error(`AxiosError [${status}]: ${JSON.stringify(data)}`);
      response.status(status ?? 502).json({
        error: 'Lambda invocation failed',
        status: status,
        message: message,
        detail: data
      });
    }
    response.status(500);
    if (error instanceof Error) {
      error.message = `API Gateway invocation failed. ${error.message}`;
    }
    throw error;
  }
});

module.exports = {
  getTestData,
  getRootUrlResponse,
  boopResponse,
  getIpAddress,
  healthCheck,
  databaseHealthCheck,

  getRawDataEtlInvocation,

  getUserSpecificSettings,

  getAllCategories,
  getAllStores,
  getAllSensisitivies,
  getAllVariableExpenses,
  getAllFixedCosts,
  getAllInvestments,
  getAllDividends,
  getAllFixedIncome,
  getAllFoodPricesAndDiscounts,
  getCurrentlyDiscountedFoodPriceInformation,
  getAllSensitivitiesOfPurchase,

  getCategoryById,
  getStoreById,
  getSensitivityById,
  getVariableExpenseById,
  getVariableExpenseByCategory,
  getFixedCostById,
  getFixedCostsByEffectiveDate,
  getFixedIncomeByEffectiveDate,
  getInvestmentById,
  getInvestmentDividendsById,
  getSensitivitiesOfPurchaseyBySensitivityId,
  getSensitivitiesOfPurchaseyByVarExpenseId
};
