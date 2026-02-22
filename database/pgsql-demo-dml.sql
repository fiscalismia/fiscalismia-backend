-- connect as fiscalismia by e.g. calling psql -c "\c fiscalismia"
SET client_encoding TO 'UTF8';
INSERT INTO test_table(description) VALUES('Hello from pgsql-dml.sql');
INSERT INTO test_table(description) VALUES('Initialized Docker-Dev-DB successfully');

/*     _____  _____ _____     _____ _   _  _____ ___________ _____ _____    ____________ ________  ___    _____  _____ _   _______  _____  _____    ______  ___ _____ ___
 *    |  __ \|  ___|_   _|   |_   _| \ | |/  ___|  ___| ___ \_   _/  ___|   |  ___| ___ \  _  |  \/  |   /  ___||  _  | | | | ___ \/  __ \|  ___|   |  _  \/ _ \_   _/ _ \
 *    | |  \/| |__   | |       | | |  \| |\ `--.| |__ | |_/ / | | \ `--.    | |_  | |_/ / | | | .  . |   \ `--. | | | | | | | |_/ /| /  \/| |__     | | | / /_\ \| |/ /_\ \
 *    | | __ |  __|  | |       | | | . ` | `--. \  __||    /  | |  `--. \   |  _| |    /| | | | |\/| |    `--. \| | | | | | |    / | |    |  __|    | | | |  _  || ||  _  |
 *    | |_\ \| |___  | |      _| |_| |\  |/\__/ / |___| |\ \  | | /\__/ /   | |   | |\ \\ \_/ / |  | |   /\__/ /\ \_/ / |_| | |\ \ | \__/\| |___    | |/ /| | | || || | | |
 *     \____/\____/  \_/      \___/\_| \_/\____/\____/\_| \_| \_/ \____/    \_|   \_| \_|\___/\_|  |_/   \____/  \___/ \___/\_| \_| \____/\____/    |___/ \_| |_/\_/\_| |_/
 *    VIA POST REQUEST TO /api/fiscalismia/tsv/variable_expenses using
 *       fixedCostsTsv.tsv
 *       incomeTsv.tsv
 *       newFoodItemsTsv.tsv
 *       investments.tsv
 *       varExpensesTsv.tsv
 *    INSERT THESE VIA PGADMIN OR OTHER CLIENT WITH PROPER UTF-8 ENCODING FOR UMLAUTS AND NOT CMD
 */
 /**

  _____ _____  _______ ____       ____ ___  ____ _____ ____
 |  ___|_ _\ \/ / ____|  _ \     / ___/ _ \/ ___|_   _/ ___|
 | |_   | | \  /|  _| | | | |   | |  | | | \___ \ | | \___ \
 |  _|  | | /  \| |___| |_| |   | |__| |_| |___) || |  ___) |
 |_|   |___/_/\_\_____|____/     \____\___/|____/ |_| |____/
 */

-- January - March
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Rent',
  1,
  660,
  660,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_HEALTH',
  'Health Supplements',
  1,
  35,
  35,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INTERNET_AND_PHONE',
  'DSL Telekom 100 MBit',
  1,
  44.95,
  44.95,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SPORTS_FACILITIES',
  'Gym Membership McFit',
  1,
  19.9,
  19.9,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Electricity Cost',
  1,
  75,
  75,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'Liability Insurance',
  12,
  114.55,
  9.55,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'STUDENT_LOANS',
  'Student Loan Interest Rate',
  1,
  120,
  120,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_GAMING',
  'WoW',
  1,
  12.99,
  12.99,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_PERFORMANCE',
  'Performance Supplements',
  1,
  20,
  20,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_TV_CINEMA',
  'Abonnement: Netflix',
  1,
  14.99,
  14.99,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.03.2024','DD.MM.YYYY')
);

-- April - August
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Rent',
  1,
  660,
  660,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INTERNET_AND_PHONE',
  'DSL Telekom 100 MBit',
  1,
  44.95,
  44.95,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SPORTS_FACILITIES',
  'Gym Membership FitOne',
  1,
  29.9,
  29.9,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Electricity Cost',
  1,
  85,
  85,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'Liability Insurance',
  12,
  114.55,
  9.55,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_MUSIC_PODCASTS',
  'Abonnement: Spotify',
  1,
  14.99,
  14.99,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'STUDENT_LOANS',
  'Student Loan Interest Rate',
  1,
  145,
  145,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'household contents insurance',
  6,
  108.53,
  18.09,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_HEALTH',
  'Health Supplements',
  1,
  45,
  45,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_GAMING',
  'Abonnement: Steady - The Pod',
  1,
  5,
  5,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_PERFORMANCE',
  'Performance Supplements',
  1,
  25,
  25,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_TV_CINEMA',
  'Abonnement: Netflix',
  1,
  14.99,
  14.99,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
-- September - current
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Rent',
  1,
  690,
  690,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_PERFORMANCE',
  'Performance Supplements',
  1,
  30,
  30,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INTERNET_AND_PHONE',
  'DSL Telekom 100 MBit',
  1,
  44.95,
  44.95,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SPORTS_FACILITIES',
  'Gym Membership FitOne',
  1,
  29.9,
  29.9,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Electricity Cost',
  1,
  95,
  95,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'Liability Insurance',
  12,
  114.55,
  9.55,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_MUSIC_PODCASTS',
  'Abonnement: Spotify',
  1,
  17.99,
  17.99,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'STUDENT_LOANS',
  'Student Loan Interest Rate',
  1,
  155,
  155,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'household contents insurance',
  6,
  108.53,
  18.09,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SUPPLEMENTS_HEALTH',
  'Health Supplements',
  1,
  25,
  25,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_GAMING',
  'Abonnement: Steady - The Pod',
  1,
  5,
  5,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LEISURE_TV_CINEMA',
  'Abonnement: Netflix',
  1,
  18.99,
  18.99,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
/**
  _____ _____  _______ ____      ___ _   _  ____ ___  __  __ _____
 |  ___|_ _\ \/ / ____|  _ \    |_ _| \ | |/ ___/ _ \|  \/  | ____|
 | |_   | | \  /|  _| | | | |    | ||  \| | |  | | | | |\/| |  _|
 |  _|  | | /  \| |___| |_| |    | || |\  | |__| |_| | |  | | |___
 |_|   |___/_/\_\_____|____/    |___|_| \_|\____\___/|_|  |_|_____|
*/
-- january - august
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Net Salary',
  'net salary',
  1,
  3080.04,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Yearly 10% Performance Bonus',
  'net salary',
  12,
  2894.24,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Gross Salary',
  'gross salary',
  1,
  4673.34,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Government Inflation Compensation',
  'gross salary',
  1,
  122.44,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('31.08.2024','DD.MM.YYYY')
);

-- september - current
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Net Salary',
  'net salary',
  1,
  3341.04,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Yearly 10% Performance Bonus',
  'net salary',
  12,
  3112.85,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Gross Salary',
  'gross salary',
  1,
  5094.34,
  TO_DATE('01.09.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);

/**
  ___ _   ___     _______ ____ _____ __  __ _____ _   _ _____ ____
 |_ _| \ | \ \   / / ____/ ___|_   _|  \/  | ____| \ | |_   _/ ___|
  | ||  \| |\ \ / /|  _| \___ \ | | | |\/| |  _| |  \| | | | \___ \
  | || |\  | \ V / | |___ ___) || | | |  | | |___| |\  | | |  ___) |
 |___|_| \_|  \_/  |_____|____/ |_| |_|  |_|_____|_| \_| |_| |____/
*/

-- year 2024
INSERT INTO investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'buy',
  'SYNBIOTIC SE NA O.N.',
  'DE000A3E5A59',
  'stock',
  'Tradegate',
  150,
  6.6,
  1001,
  11,
  TO_DATE('01.02.2024','DD.MM.YYYY')
);
INSERT INTO investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'sell',
  'SYNBIOTIC SE NA O.N.',
  'DE000A3E5A59',
  'stock',
  'Tradegate',
  150,
  13.25,
  1977.5,
  10,
  TO_DATE('27.02.2024','DD.MM.YYYY')
);
INSERT INTO investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'buy',
  'CD PROJEKT S.A. C ZY 1',
  'PLOPTTC00011',
  'stock',
  'Stuttgart',
  42,
  24.46,
  1024.11,
  15.79,
  TO_DATE('18.04.2024','DD.MM.YYYY')
);

INSERT INTO investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'buy',
  'ZALANDO SE',
  'DE000ZAL1111',
  'stock',
  'Tradegate',
  52,
  19.25,
  950,
  10,
  TO_DATE('27.06.2024','DD.MM.YYYY')
);

INSERT INTO investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'buy',
  'BAYER AG NA O.N.',
  'DE000BAY0017',
  'stock',
  'Tradegate',
  69,
  28.78,
  1865.82,
  11,
  TO_DATE('14.09.2024','DD.MM.YYYY')
);
-- investment SELL tax
INSERT INTO investment_taxes (investment_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
(
  SELECT
    id,
    0,
    977,
    0.00,
    extract( year FROM TO_DATE('27.02.2024','DD.MM.YYYY') )::int
  FROM investments
  WHERE isin = 'DE000A3E5A59'
    AND execution_date = TO_DATE('27.02.2024','DD.MM.YYYY')
    AND execution_type = 'sell' --unique key of investments
);

-- Dividend 1 and Tax
INSERT INTO investment_dividends (isin, dividend_amount, dividend_date)
VALUES('DE000A3E5A59', 24, TO_DATE('15.02.2024','DD.MM.YYYY'));
INSERT INTO investment_taxes (dividend_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
(
  SELECT
  id,
  0,
  24,
  0.00,
  2024
  FROM investment_dividends
  WHERE isin = 'DE000A3E5A59'
    AND dividend_date = TO_DATE('15.02.2024','DD.MM.YYYY') -- unique key of investment_dividends
    );
INSERT INTO bridge_investment_dividends (investment_id, dividend_id, remaining_units)
VALUES (1,1,150);

-- Dividend 2 and Tax
INSERT INTO investment_dividends (isin, dividend_amount, dividend_date)
VALUES('PLOPTTC00011', 35, TO_DATE('16.07.2024','DD.MM.YYYY'));
INSERT INTO investment_taxes (dividend_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
(
  SELECT
    id,
    100,
    35,
    9.23,
    extract( year FROM TO_DATE('16.07.2024','DD.MM.YYYY') )::int
  FROM investment_dividends
  WHERE isin = 'PLOPTTC00011'
    AND dividend_date = TO_DATE('16.07.2024','DD.MM.YYYY') -- unique key of investment_dividends
);
INSERT INTO bridge_investment_dividends (investment_id, dividend_id, remaining_units)
VALUES (3,2,42);

/**
  ____  _   _ ____  _____ ____  __  __    _    ____  _  _______ _____     _____ ___   ___  ____      ____  ____  ___ ____ _____ ____
 / ___|| | | |  _ \| ____|  _ \|  \/  |  / \  |  _ \| |/ / ____|_   _|   |  ___/ _ \ / _ \|  _ \    |  _ \|  _ \|_ _/ ___| ____/ ___|
 \___ \| | | | |_) |  _| | |_) | |\/| | / _ \ | |_) | ' /|  _|   | |     | |_ | | | | | | | | | |   | |_) | |_) || | |   |  _| \___ \
  ___) | |_| |  __/| |___|  _ <| |  | |/ ___ \|  _ <| . \| |___  | |     |  _|| |_| | |_| | |_| |   |  __/|  _ < | | |___| |___ ___) |
 |____/ \___/|_|   |_____|_| \_\_|  |_/_/   \_\_| \_\_|\_\_____| |_|     |_|   \___/ \___/|____/    |_|   |_| \_\___\____|_____|____/
*/
INSERT INTO table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'MCT Oil C-8, Organic',
  'GreatVita',
  'Amazon',
  'Fat',
  900,
  1000,
  24.99,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Black Olives, no stones',
  'Kings Crown',
  'Aldi Süd',
  'Fat',
  134,
  170,
  1.19,
  TO_DATE('01.03.2024','DD.MM.YYYY'),
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Basmati Rice',
  'Golden Sun',
  'Lidl',
  'Carbs',
  354,
  500,
  1.19,
  TO_DATE('15.02.2024','DD.MM.YYYY'),
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Salmon filet, frozen',
  'Paulus',
  'Kaufland',
  'Protein',
  223,
  1000,
  19.49,
  TO_DATE('10.03.2023','DD.MM.YYYY'),
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO food_price_discounts(
	food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
	VALUES ((SELECT dimension_key FROM table_food_prices WHERE food_item = 'Salmon filet, frozen' AND brand = 'Paulus'), 16.99, current_date-1, current_date+7);

/**
 __     ___    ____  ___    _    ____  _     _____       _______  ______  _____ _   _ ____  _____ ____
 \ \   / / \  |  _ \|_ _|  / \  | __ )| |   | ____|     | ____\ \/ /  _ \| ____| \ | / ___|| ____/ ___|
  \ \ / / _ \ | |_) || |  / _ \ |  _ \| |   |  _|       |  _|  \  /| |_) |  _| |  \| \___ \|  _| \___ \
   \ V / ___ \|  _ < | | / ___ \| |_) | |___| |___      | |___ /  \|  __/| |___| |\  |___) | |___ ___) |
    \_/_/   \_\_| \_\___/_/   \_\____/|_____|_____|     |_____/_/\_\_|   |_____|_| \_|____/|_____|____/
*/
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero',
INITCAP('Groceries'),
INITCAP('Kiosk'),
4.2,
TO_DATE('01.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chicken, Carrots, Broccoli, Coconut Milk',
INITCAP('Groceries'),
INITCAP('Aldi Süd'),
10.77,
TO_DATE('05.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Riesling Wine, Dry',
INITCAP('Leisure'),
INITCAP('Gas Station'),
5.9,
TO_DATE('03.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('alcohol')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Grandma Birthday Present',
INITCAP('Gift'),
INITCAP('Family'),
50,
TO_DATE('21.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Wash, Tooth Paste',
INITCAP('Hygiene'),
INITCAP('dm'),
5.1,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olives, Coke Zero, Mirinda Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
15.32,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Cream, Hyaluron Face Serum, Toothpaste',
INITCAP('Hygiene'),
INITCAP('Rossman'),
22.81,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Resident Evil 4 Remake',
INITCAP('Leisure'),
INITCAP('Steam'),
39.99,
TO_DATE('01.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Almond flour defatted',
INITCAP('Groceries'),
INITCAP('Amazon'),
16.93,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Döner plate rice veal salad, Adana skewer',
INITCAP('Leisure'),
INITCAP('Döner'),
38,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('Processed meat, rice, cow''s milk product')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Dark chocolate, iced tea zero',
INITCAP('Groceries'),
INITCAP('Rewe'),
3.83,
TO_DATE('03.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, chocolate, sugar')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Arctic shrimp frozen, coconut milk, organic eggs, salmon frozen',
INITCAP('Groceries'),
INITCAP('Lidl'),
25,
TO_DATE('03.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Cola Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
5.9,
TO_DATE('04.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Day cream',
INITCAP('Hygiene'),
INITCAP('Rossman'),
8.45,
TO_DATE('04.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'White mulberry tea, vanilla rooibos tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
12,
TO_DATE('04.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Black tea decaffeinated',
INITCAP('Leisure'),
INITCAP('Teeladen'),
8.9,
TO_DATE('04.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Düsseldorf day trip meals',
INITCAP('Vacation'),
INITCAP('Düsseldorf'),
53,
TO_DATE('05.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, salad',
INITCAP('Groceries'),
INITCAP('Lidl'),
112,
TO_DATE('06.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, organic eggs, salad, avocado, fennel, red onions',
INITCAP('Groceries'),
INITCAP('Lidl'),
73.88,
TO_DATE('09.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Embroidery thread',
INITCAP('Leisure'),
INITCAP('Craft store'),
16.5,
TO_DATE('09.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Organic eggs, soft drink, iced tea zero, vegan cheese, mustard, dark chocolate',
INITCAP('Groceries'),
INITCAP('hit market'),
27,
TO_DATE('09.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, sugar, starch')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
2,
TO_DATE('10.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Basil candle, beeswax candle',
INITCAP('Leisure'),
INITCAP('Candle store'),
20.5,
TO_DATE('10.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Green tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
11.6,
TO_DATE('10.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cetirizine 100pcs',
INITCAP('Medical Expenses'),
INITCAP('Pharmacy'),
12.5,
TO_DATE('11.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('11.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olive oil',
INITCAP('Groceries'),
INITCAP('Alnatura'),
13.98,
TO_DATE('11.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Brazil nuts, walnut kernels, hazelnuts',
INITCAP('Groceries'),
INITCAP('Rewe'),
16.98,
TO_DATE('11.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('14.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('18.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('19.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('22.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('24.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
12.5,
TO_DATE('12.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
17.5,
TO_DATE('02.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
14.5,
TO_DATE('12.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
22.5,
TO_DATE('12.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
18.5,
TO_DATE('19.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
34.5,
TO_DATE('28.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('01.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('26.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('07.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('28.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('12.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('18.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('24.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Haircut & Shave',
INITCAP('Hygiene'),
INITCAP('Barbershop'),
40,
TO_DATE('17.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('16.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('11.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('07.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('22.01.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables, Cola Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
22,
TO_DATE('13.01.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
28,
TO_DATE('19.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
25,
TO_DATE('25.01.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
--FEBRUARY

INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero',
INITCAP('Groceries'),
INITCAP('Kiosk'),
6.2,
TO_DATE('01.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chicken, Carrots, Broccoli, Coconut Milk',
INITCAP('Groceries'),
INITCAP('Aldi Süd'),
10.77,
TO_DATE('05.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Riesling Wine, Dry, Beer',
INITCAP('Leisure'),
INITCAP('Gas Station'),
15.9,
TO_DATE('03.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('alcohol')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Beer',
INITCAP('Leisure'),
INITCAP('Gas Station'),
12.9,
TO_DATE('15.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('alcohol')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Mom Birthday Present',
INITCAP('Gift'),
INITCAP('Family'),
40,
TO_DATE('21.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Wash, Tooth Paste',
INITCAP('Hygiene'),
INITCAP('dm'),
15.1,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olives, Coke Zero, Mirinda Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
15.32,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Cream, Hyaluron Face Serum, Toothpaste',
INITCAP('Hygiene'),
INITCAP('Rossman'),
22.81,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Almond flour defatted',
INITCAP('Groceries'),
INITCAP('Amazon'),
16.93,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Döner plate rice veal salad, Adana skewer',
INITCAP('Leisure'),
INITCAP('Döner'),
38,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('Processed meat, rice, cow''s milk product')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Dark chocolate, iced tea zero',
INITCAP('Groceries'),
INITCAP('Rewe'),
3.83,
TO_DATE('03.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, chocolate, sugar')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Arctic shrimp frozen, coconut milk, organic eggs, salmon frozen',
INITCAP('Groceries'),
INITCAP('Lidl'),
25,
TO_DATE('03.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Cola Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
5.9,
TO_DATE('04.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Day cream',
INITCAP('Hygiene'),
INITCAP('Rossman'),
8.45,
TO_DATE('04.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'White mulberry tea, vanilla rooibos tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
12,
TO_DATE('04.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Black tea decaffeinated',
INITCAP('Leisure'),
INITCAP('Teeladen'),
12.9,
TO_DATE('04.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Heidelberg day trip meals',
INITCAP('Vacation'),
INITCAP('Heidelberg'),
142,
TO_DATE('05.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, salad',
INITCAP('Groceries'),
INITCAP('Lidl'),
112,
TO_DATE('06.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, organic eggs, salad, avocado, fennel, red onions',
INITCAP('Groceries'),
INITCAP('Lidl'),
73.88,
TO_DATE('09.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Embroidery thread',
INITCAP('Leisure'),
INITCAP('Craft store'),
16.5,
TO_DATE('09.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Organic eggs, soft drink, iced tea zero, vegan cheese, mustard, dark chocolate',
INITCAP('Groceries'),
INITCAP('hit market'),
27,
TO_DATE('09.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, sugar, starch')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
2,
TO_DATE('10.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Basil candle, beeswax candle',
INITCAP('Leisure'),
INITCAP('Candle store'),
20.5,
TO_DATE('10.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Green tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
11.6,
TO_DATE('10.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cetirizine 100pcs',
INITCAP('Medical Expenses'),
INITCAP('Pharmacy'),
12.5,
TO_DATE('11.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('11.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olive oil',
INITCAP('Groceries'),
INITCAP('Alnatura'),
13.98,
TO_DATE('11.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Brazil nuts, walnut kernels, hazelnuts',
INITCAP('Groceries'),
INITCAP('Rewe'),
16.98,
TO_DATE('11.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
2.5,
TO_DATE('14.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
3.5,
TO_DATE('18.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun, Croissant',
INITCAP('Gift'),
INITCAP('Bakery'),
5.5,
TO_DATE('19.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun, Cake',
INITCAP('Gift'),
INITCAP('Bakery'),
9.5,
TO_DATE('22.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('24.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
18.5,
TO_DATE('12.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
17.5,
TO_DATE('02.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
14.5,
TO_DATE('12.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
22.5,
TO_DATE('12.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
18.5,
TO_DATE('19.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
34.5,
TO_DATE('28.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('07.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
12.50,
TO_DATE('28.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('12.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('18.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('24.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Haircut & Shave',
INITCAP('Hygiene'),
INITCAP('Barbershop'),
40,
TO_DATE('17.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('16.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('11.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
30,
TO_DATE('07.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('22.02.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables, Cola Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
18,
TO_DATE('13.02.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
28,
TO_DATE('19.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
48,
TO_DATE('25.02.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);

--MARCH
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Factorio',
  INITCAP('Leisure'),
  INITCAP('Steam'),
  29.99,
  TO_DATE('01.03.2024','DD.MM.YYYY'),
  'N',
  'N',
  LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero',
INITCAP('Groceries'),
INITCAP('Kiosk'),
6.2,
TO_DATE('01.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chicken, Carrots, Broccoli, Coconut Milk',
INITCAP('Groceries'),
INITCAP('Aldi Süd'),
10.77,
TO_DATE('05.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Riesling Wine, Dry, Beer',
INITCAP('Leisure'),
INITCAP('Gas Station'),
15.9,
TO_DATE('03.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('alcohol')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Beer',
INITCAP('Leisure'),
INITCAP('Gas Station'),
12.9,
TO_DATE('15.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('alcohol')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Friend Birthday Present',
INITCAP('Gift'),
INITCAP('Friends'),
20,
TO_DATE('21.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Wash, Tooth Paste',
INITCAP('Hygiene'),
INITCAP('dm'),
15.1,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olives, Coke Zero, Mirinda Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
15.32,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Face Cream, Hyaluron Face Serum, Toothpaste',
INITCAP('Hygiene'),
INITCAP('Rossman'),
22.81,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Almond flour defatted',
INITCAP('Groceries'),
INITCAP('Amazon'),
16.93,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Döner plate rice veal salad, Adana skewer',
INITCAP('Leisure'),
INITCAP('Döner'),
38,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('Processed meat, rice, cow''s milk product')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Dark chocolate, iced tea zero',
INITCAP('Groceries'),
INITCAP('Rewe'),
3.83,
TO_DATE('03.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, chocolate, sugar')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Arctic shrimp frozen, coconut milk, organic eggs, salmon frozen',
INITCAP('Groceries'),
INITCAP('Lidl'),
33,
TO_DATE('03.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Cola Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
5.9,
TO_DATE('04.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Day cream',
INITCAP('Hygiene'),
INITCAP('Rossman'),
12.45,
TO_DATE('04.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'White mulberry tea, vanilla rooibos tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
12,
TO_DATE('04.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Black tea decaffeinated',
INITCAP('Leisure'),
INITCAP('Teeladen'),
12.9,
TO_DATE('04.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, salad',
INITCAP('Groceries'),
INITCAP('Lidl'),
68,
TO_DATE('06.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Salmon frozen, olives, Cola Zero, organic eggs, salad, avocado, fennel, red onions',
INITCAP('Groceries'),
INITCAP('Lidl'),
45.88,
TO_DATE('09.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Embroidery thread',
INITCAP('Leisure'),
INITCAP('Craft store'),
16.5,
TO_DATE('09.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Organic eggs, soft drink, iced tea zero, vegan cheese, mustard, dark chocolate',
INITCAP('Groceries'),
INITCAP('hit market'),
27,
TO_DATE('09.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('sucralose, sugar, starch')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
2,
TO_DATE('10.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
3,
TO_DATE('05.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);

INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
4,
TO_DATE('17.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);

INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Tea, Energy Zero',
INITCAP('Groceries'),
INITCAP('Rossman'),
2.9,
TO_DATE('22.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Basil candle, beeswax candle',
INITCAP('Leisure'),
INITCAP('Candle store'),
20.5,
TO_DATE('10.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Green tea',
INITCAP('Leisure'),
INITCAP('Teeladen'),
11.6,
TO_DATE('10.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Ibuprofen 600mg, Aspirin Complex',
INITCAP('Medical Expenses'),
INITCAP('Pharmacy'),
18.5,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Buscopan Plus',
INITCAP('Medical Expenses'),
INITCAP('Pharmacy'),
10.5,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cetirizine 100pcs',
INITCAP('Medical Expenses'),
INITCAP('Pharmacy'),
12.5,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Olive oil',
INITCAP('Groceries'),
INITCAP('Alnatura'),
13.98,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Brazil nuts, walnut kernels, hazelnuts',
INITCAP('Groceries'),
INITCAP('Rewe'),
22.98,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
2.5,
TO_DATE('14.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
3.5,
TO_DATE('18.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun, Croissant',
INITCAP('Gift'),
INITCAP('Bakery'),
5.5,
TO_DATE('19.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun, Cake',
INITCAP('Gift'),
INITCAP('Bakery'),
9.5,
TO_DATE('22.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Chocolate bun',
INITCAP('Gift'),
INITCAP('Bakery'),
1.5,
TO_DATE('24.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
18.5,
TO_DATE('12.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
17.5,
TO_DATE('02.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Snacks for Girlfriend',
INITCAP('Gift'),
INITCAP('Rewe'),
14.5,
TO_DATE('12.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
31.5,
TO_DATE('12.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
22.5,
TO_DATE('19.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Food for Girlfriend',
INITCAP('Groceries'),
INITCAP('Lidl'),
34.5,
TO_DATE('28.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('07.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
12.50,
TO_DATE('28.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('12.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('18.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cola Zero, Energy Zero, Dark Chocolate',
INITCAP('Leisure'),
INITCAP('Kiosk'),
6.50,
TO_DATE('24.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin, sugar, chocolate')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Haircut & Shave',
INITCAP('Hygiene'),
INITCAP('Barbershop'),
45,
TO_DATE('17.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
14,
TO_DATE('16.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
18,
TO_DATE('11.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
30,
TO_DATE('07.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Cappucino, Iced Latte, Black Tea with Oatmilk',
INITCAP('Work'),
INITCAP('Café'),
19,
TO_DATE('22.03.2024','DD.MM.YYYY'),
'J',
'J',
LOWER('caffeine')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables, Cola Zero',
INITCAP('Groceries'),
INITCAP('Lidl'),
22,
TO_DATE('13.03.2024','DD.MM.YYYY'),
'N',
'J',
LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
28,
TO_DATE('19.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Steak, Salmon, Vegetables',
INITCAP('Groceries'),
INITCAP('Lidl'),
48,
TO_DATE('25.03.2024','DD.MM.YYYY'),
'N',
'N',
LOWER('')
);

-- SALES
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Ibanez Xiphos XPT700 E-Guitar',
INITCAP('Sale'),
INITCAP('Ebay'),
-275,
TO_DATE('13.01.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'140kg Cast Iron Homegym Weights',
INITCAP('Sale'),
INITCAP('Ebay'),
-180,
TO_DATE('13.03.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);
INSERT INTO staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
'Monitor 32 Inch OLED WQHD',
INITCAP('Sale'),
INITCAP('Ebay'),
-183.0,
TO_DATE('13.02.2024','DD.MM.YYYY'),
'J',
'N',
LOWER('')
);

SELECT ETL_VARIABLE_EXPENSES();
TRUNCATE TABLE staging_variable_bills;