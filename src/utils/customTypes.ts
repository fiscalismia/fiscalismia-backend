/**
 * @table public.um_users
 * @property {number} userId SELECT id FROM public.um_users
 * @property {string} userName SELECT username FROM public.um_users
 * @property {string} userEmail SELECT email FROM public.um_users
 * @property {string} userSchema SELECT schema FROM public.um_users
 */
export type User = {
  userId: number;
  userName: string;
  userEmail: string;
  userSchema: string;
};

/**
 * User Credentials Object used for e.g. Account Creation and INSERT into table public.um_users.
 * @table public.um_users
 * @property {number} username SELECT id FROM public.um_users
 * @property {string | null} email SELECT email FROM public.um_users
 * @property {string} password salted and hashed via pgcrypto crypt('PASSWORD', gen_salt('bf',ITER_COUNT))
 */
export type UserCredentials = {
  username: string;
  email: string | null;
  password: string;
};

/**
 * Username for subsequently querying id from public.um_users and the setting key value pairs to insert into table public.um_user_settings
 * @table public.um_users, public.um_user_settings
 * @property {string} username SELECT id FROM public.um_users WHERE username = 'username'
 * @property {string} settingKey setting_key column of um_user_settings
 * @property {string} settingValue setting_value column of um_user_settings
 */
export type UserSettingObject = {
  username: string;
  settingKey: string;
  settingValue: string;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for variable epenses ETL.
 * @table staging_variable_bills
 */
export type StagingVariableBills = {
  description: string;
  category: string;
  store: string;
  cost: number;
  purchasing_date: string;
  is_planned: string;
  contains_indulgence: string;
  sensitivities: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for monthly Fixed Costs.
 * @table fixed_costs
 */
export type FixedCosts = {
  category: string;
  description: string;
  monthly_interval: number;
  billed_cost: number;
  monthly_cost: number;
  effective_date: string;
  expiration_date: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for monthly Fixed Income.
 * @table fixed_income
 */
export type FixedIncome = {
  description: string;
  type: string;
  monthly_interval: number;
  value: number;
  effective_date: string;
  expiration_date: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * The Lambda code defines the following filenames in the file
 * functions/python/Fiscalismia_RawDataETL/extract_transform.py
    "variable_expenses", "fixed_costs", "investments", "income", "food_items"
 */
export type TsvFilenames = {
  filenames: 'variable_expenses' | 'fixed_costs' | 'investments' | 'income' | 'food_items';
};

export type TsvRouteMap = Record<TsvFilenames['filenames'], string>;

export type TsvTableInsertData = Record<TsvFilenames['filenames'], string>;

export const tsvRouteMap: TsvRouteMap = {
  variable_expenses: '/api/fiscalismia/texttsv/variable_expenses',
  fixed_costs: '/api/fiscalismia/texttsv/fixed_costs',
  investments: '/api/fiscalismia/texttsv/investments',
  income: '/api/fiscalismia/texttsv/fixed_income',
  food_items: '/api/fiscalismia/texttsv/new_food_items'
};
/**
 * Map containing table category keys and insert statements populated dynamically via backend logic
 */
export const tsvRouteData: TsvTableInsertData = {
  variable_expenses: '',
  fixed_costs: '',
  investments: '',
  income: '',
  food_items: ''
};
/**
 * Bought investments are stored in investments table, if the execution type is sell, tax information is added for investment_taxes table.
 * @description For DB INSERTION via TSV bulk Inserts rather than manual Entry from the frontend
 * @see https://github.com/hangrybear666/fiscalismia-frontend/blob/main/src/types/custom/customTypes.ts
 * @table investments, investment_taxes
 * @property {string} execution_type string containing the type of execution -> 'buy' or 'sell' *
 * @property {string} description Description of the investment
 * @property {string} isin DIFFERENT FROM FRONTEND WHERE IT IS A CUSTOM TWELVE CHARACTER STRING - International Security Identification Number -> 12 character string beginning with country short
 * @property {string} investment_type Type of investment
 * @property {string} marketplace Marketplace where the investment was bought from or sold at
 * @property {number} units Number of shares purchased or sold
 * @property {number} price_per_unit Price per unit of the share
 * @property {number} total_price Total price of the investment including fees
 * @property {number} fees Fees paid for the investment execution
 * @property {Date} execution_date DIFFERENT FROM FRONTEND WHERE IT IS A DATE - Date of the investment transaction execution
 * @property {number | null} pct_of_profit_taxed Percentage of profit taxed (nullable for execution_type buy)
 * @property {number | null} profit_amt Amount of profit generated from the investment (nullable for execution_type buy)
 */
export type InvestmentAndTaxes = {
  execution_type: string;
  description: string;
  isin: string; // DIFFERENT FROM FRONTEND WHERE IT IS A CUSTOM TWELVE CHARACTER STRING
  investment_type: string;
  marketplace: string;
  units: number;
  price_per_unit: number;
  total_price: number;
  fees: number;
  execution_date: string; // DIFFERENT FROM FRONTEND WHERE IT IS A DATE
  pct_of_profit_taxed: number | null;
  profit_amt: number | null;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number | null;
};

/**
 * id, price and date range for a temporarily discounted food item
 * @description For DB INSERTION via TSV bulk Inserts rather than manual Entry from the frontend
 * @see https://github.com/hangrybear666/fiscalismia-frontend/blob/main/src/types/custom/customTypes.ts
 * @table food_price_discounts
 * @property {string} food_item string of a food item
 * @property {string} brand Brand of the food item
 * @property {string} store Store where the food item is purchased
 * @property {string} main_macro Main macronutrient of the food item
 * @property {number} kcal_amount Caloric amount of the food item
 * @property {number} weight Weight of the food item
 * @property {number} price Price of the food item
 * @property {string} last_update DIFFERENT THAN FRONTEND WHERE IT IS A DATE - Date of last price check
 */
export type FoodItem = {
  food_item: string;
  brand: string;
  store: string;
  main_macro: string;
  kcal_amount: number;
  weight: number;
  price: number;
  last_update: string; // DIFFERENT THAN FRONTEND WHERE IT IS A DATE
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

export interface PostgresError extends Error {
  length: number;
  name: string;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}
