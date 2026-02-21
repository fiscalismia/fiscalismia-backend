const userSchemaRoutes = require('express').Router();
const {
  getTestData,

  getRawDataEtlInvocation,

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
  getInvestmentById,
  getInvestmentDividendsById,
  getFixedCostById,
  getFixedCostsByEffectiveDate,
  getFixedIncomeByEffectiveDate,
  getSensitivitiesOfPurchaseyBySensitivityId,
  getSensitivitiesOfPurchaseyByVarExpenseId
} = require('../controllers/read_postgresController');
const {
  postTestData,
  postFoodItemDiscount,
  postNewFoodItem,
  postNewFoodItemsTextTsv,

  postInvestmentAndTaxes,
  postDividendsAndTaxes,

  postInvestmentsTextTsv,
  postVariableExpensesTextTsv,
  postFixedCostsTextTsv,
  postIncomeTextTsv
} = require('../controllers/create_postgresController');
const { updateTestData, updateFoodItemPrice } = require('../controllers/update_postgresController');
const {
  truncateAllUserSchemaTables,

  deleteTestData,
  deleteFoodItem,
  deleteFoodItemDiscount,
  deleteInvestment,
  deleteInvestmentDividend
} = require('../controllers/delete_postgresController');

//  ___  ___  __  ___
//   |  |__  /__`  |
//   |  |___ .__/  |

userSchemaRoutes.get('/', getTestData);
userSchemaRoutes.post('/', postTestData);
userSchemaRoutes.put('/:id', updateTestData);
userSchemaRoutes.delete('/:id', deleteTestData);
//   __   ___       __
//  |__) |__   /\  |  \
//  |  \ |___ /~~\ |__/

// adminArea
userSchemaRoutes.get('/admin/raw_data_etl', getRawDataEtlInvocation);

// getAll
userSchemaRoutes.get('/category', getAllCategories);
userSchemaRoutes.get('/store', getAllStores);
userSchemaRoutes.get('/sensitivity', getAllSensisitivies);
userSchemaRoutes.get('/variable_expenses', getAllVariableExpenses);
userSchemaRoutes.get('/investments', getAllInvestments);
userSchemaRoutes.get('/investment_dividends', getAllDividends);
userSchemaRoutes.get('/fixed_costs', getAllFixedCosts);
userSchemaRoutes.get('/fixed_income', getAllFixedIncome);
userSchemaRoutes.get('/food_prices_and_discounts', getAllFoodPricesAndDiscounts);
userSchemaRoutes.get('/discounted_foods_current', getCurrentlyDiscountedFoodPriceInformation);
userSchemaRoutes.get('/sensitivities_of_purchase', getAllSensitivitiesOfPurchase);
// getSpecificData
userSchemaRoutes.get('/category/:id', getCategoryById);
userSchemaRoutes.get('/store/:id', getStoreById);
userSchemaRoutes.get('/sensitivity/:id', getSensitivityById);
userSchemaRoutes.get('/variable_expenses/:id', getVariableExpenseById);
userSchemaRoutes.get('/variable_expenses/category/:category', getVariableExpenseByCategory);
userSchemaRoutes.get('/investments/:id', getInvestmentById);
userSchemaRoutes.get('/investment_dividends/:id', getInvestmentDividendsById);
userSchemaRoutes.get('/fixed_costs/:id', getFixedCostById);
userSchemaRoutes.get('/fixed_costs/valid/:date', getFixedCostsByEffectiveDate);
userSchemaRoutes.get('/fixed_income/valid/:date', getFixedIncomeByEffectiveDate);
userSchemaRoutes.get('/sensitivities_of_purchase/sensitivity/:id', getSensitivitiesOfPurchaseyBySensitivityId);
userSchemaRoutes.get('/sensitivities_of_purchase/var_expense/:id', getSensitivitiesOfPurchaseyByVarExpenseId);

//   __   __   ___      ___  ___
//  /  ` |__) |__   /\   |  |__
//  \__, |  \ |___ /~~\  |  |___

userSchemaRoutes.post('/texttsv/variable_expenses', postVariableExpensesTextTsv);
userSchemaRoutes.post('/texttsv/fixed_costs', postFixedCostsTextTsv);
userSchemaRoutes.post('/texttsv/fixed_income', postIncomeTextTsv);
userSchemaRoutes.post('/texttsv/new_food_items', postNewFoodItemsTextTsv);
userSchemaRoutes.post('/texttsv/investments', postInvestmentsTextTsv);

userSchemaRoutes.post('/food_item_discount', postFoodItemDiscount);
userSchemaRoutes.post('/food_item', postNewFoodItem);
userSchemaRoutes.post('/investments', postInvestmentAndTaxes);
userSchemaRoutes.post('/investment_dividends', postDividendsAndTaxes);

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

userSchemaRoutes.put('/food_item/price/:id', updateFoodItemPrice);
//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___

// adminArea
userSchemaRoutes.delete('/admin/user_schema/truncate_all', truncateAllUserSchemaTables);

userSchemaRoutes.delete('/food_item/:dimension_key', deleteFoodItem);
userSchemaRoutes.delete('/investment/:id', deleteInvestment);
userSchemaRoutes.delete('/investment_dividend/:id', deleteInvestmentDividend);
userSchemaRoutes.delete('/food_item_discount/:food_prices_dimension_key/:discount_start_date', deleteFoodItemDiscount);

module.exports = userSchemaRoutes;
