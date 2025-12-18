/* eslint-disable no-console */
import request from 'supertest';
require('dotenv').config();
import { app } from '../app';
import { InvestmentAndTaxes, UserSettingObject } from '../utils/customTypes';
const { pool } = require('../utils/pgDbService');

/*    __   __                          __          __        ___  __
|    /  \ /  `  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
|___ \__/ \__, /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/*/

const API_ENDPOINT = '/api/fiscalismia';
let authToken: string = '';
const currentDate = new Date();
const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes() + 'and ' + currentDate.getSeconds() + 's';
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(currentDate.getDate()).padStart(2, '0');
const dbDateStr = `${year}-${month}-${day}`;

describe('supertest REST API testing entire REST functionality', () => {
  let maxTestTableId: number;
  let insertedId: number;
  const insertedFoodItemDimensionKeys: number[] = [];
  let purchasedInvestmentId: number;
  let soldInvestmentId: number;
  let addedDividendId: number;
  const username = 'admin';
  const password = 'changeit';
  const userSchema = `private_${username}`;
  const newDbUser = 'hangrybear';
  const newDbUserSchema = `private_${newDbUser}`;

  //          ___           ___          __        ___  __        __
  //    |__| |__   /\  |     |  |__|    /  ` |__| |__  /  ` |__/ /__`
  //    |  | |___ /~~\ |___  |  |  |    \__, |  | |___ \__, |  \ .__/
  test('HEALTH CHECK backend connectivity', (done) => {
    request(app)
      .get(`${API_ENDPOINT}/hc`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body).toBeDefined();
        expect(res.body.status).toBeDefined();
        expect(res.body.status).toEqual('OK');
        expect(res.body.node_uptime_hours).toBeDefined();
        expect(res.body.server_uptime_hours).toBeDefined();
        return done();
      });
  });

  test('HEALTH CHECK database connectivity', (done) => {
    request(app)
      .get(`${API_ENDPOINT}/db_hc`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body).toBeDefined();
        expect(res.body.status).toBeDefined();
        expect(res.body.status).toEqual('OK');
        expect(res.body.postgres_version).toBeDefined();
        expect(res.body.up_time).toBeDefined();
        return done();
      });
  });

  //              ___          __   ___  __        ___  __  ___  __
  //     /\  |  |  |  |__|    |__) |__  /  \ |  | |__  /__`  |  /__`
  //    /~~\ \__/  |  |  |    |  \ |___ \__X \__/ |___ .__/  |  .__/
  test('AUTH read fiscalismia root w/o authentication fails', (done) => {
    request(app)
      .get(API_ENDPOINT)
      .expect(401)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login w/o pswd fails', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/login`)
      .send({
        username: username,
        email: 'herpderp@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login with wrong pswd fails', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/login`)
      .send({
        username: username,
        password: 'kjlfaeijoawfe'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user with missing username returns 400 Bad Request', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: '',
        email: 'randomuser@randomdomain.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user with missing email returns 400 Bad Request', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'randomUser',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user with missing password returns 400 Bad Request', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'randomuser@randomdomain.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid username returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: '\\**+?!#',
        email: 'randomuser@randomdomain.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid email returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'ʕ•ᴥ•ʔ@.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid pswd returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'randomuser@randomdomain.com',
        password: 'ʕ•ᴥ•ʔ'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w username length above 32 returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'randomUserrandomUserrandomUserrandomUserrandomUserserrandomUserrandomUserrandomUser',
        email: 'randomuser@randomdomain.com',
        password: 'asdasdasd1'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w username containing any special characters except underscores returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: 'random-user!',
        email: 'randomuser@randomdomain.com',
        password: 'asdasdasd1'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create new user with valid input returns 201 CREATED', async () => {
    const client = await pool.connect();
    try {
      const sql = `SELECT id, username FROM public.um_users WHERE username = '${newDbUser}'`;
      await client.query('BEGIN');
      const result = await client.query(sql);
      if (result.rows && result.rows.length > 0 && result.rows[0].username === newDbUser) {
        console.log(`User ${newDbUser} already exists. Skipping creation test.`);
      } else {
        await request(app)
          .post(`${API_ENDPOINT}/um/credentials`)
          .send({
            username: newDbUser,
            email: 'hangrybear@maildomain.com',
            password: 'changeit123'
          })
          .expect('Content-Type', /json/)
          .expect(201);
      }
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  test('AUTH create duplicate user with valid input returns 409 CONFLICT ', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/credentials`)
      .send({
        username: newDbUser,
        email: 'hangrybear@maildomain.com',
        password: 'changeit123'
      })
      .expect('Content-Type', /json/)
      .expect(409)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login /w correct credentials succeeds', (done) => {
    request(app)
      .post(`${API_ENDPOINT}/um/login`)
      .send({
        username: username,
        password: password
      })
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          return done(err);
        }
        // set local authentication token variable to text of login response
        authToken = res.text;
        return done();
      });
  });

  test('AUTH UserSchemas for all db users have positive tablecount', async () => {
    const client = await pool.connect();
    try {
      const sql = `SELECT
          schemaname, COUNT(tablename) as cnt
        FROM pg_catalog.pg_tables
        where schemaname in ('${userSchema}','${newDbUserSchema}','public')
        group by schemaname`;
      await client.query('BEGIN');
      const result = await client.query(sql);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].schemaname).toBeDefined();
      let userSchemaTableCount = 0;
      let newDbUserSchemaTableCount = 0;
      let publicSchemaTableCount = 0;
      result.rows.forEach((e: any) => {
        switch (e.schemaname) {
          case userSchema:
            userSchemaTableCount = e.cnt;
            break;
          case newDbUserSchema:
            newDbUserSchemaTableCount = e.cnt;
            break;
          case 'public':
            publicSchemaTableCount = e.cnt;
            break;
          default:
            break;
        }
      });
      expect(userSchemaTableCount).toBeGreaterThan(0);
      expect(newDbUserSchemaTableCount).toBeGreaterThan(0);
      expect(publicSchemaTableCount).toBeGreaterThan(0);
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  //    ___  ___  __  ___    ___       __        ___
  //     |  |__  /__`  |      |   /\  |__) |    |__
  //     |  |___ .__/  |      |  /~~\ |__) |___ |___
  //
  test('TEST_TABLE POST request', (done) => {
    request(app)
      .post(`${API_ENDPOINT}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: 'Inserted from Supertest [supertest_read_write_api.test.ts] at [' + currentTime + ']'
      })
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedId = Number(res.body.results[0].id);
        return done();
      });
  });

  test('TEST_TABLE GET request', (done) => {
    request(app)
      .get(`${API_ENDPOINT}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        // set max id (which is the one just inserted via post) for update and delete
        const idsDescending = res.body.results.map((e: any) => Number(e.id)).sort((a: number, b: number) => b - a);
        maxTestTableId = idsDescending[0];
        expect(maxTestTableId).toEqual(insertedId);
        return done();
      });
  });

  test('TEST_TABLE UPDATE request', (done) => {
    const updatedDescription = 'Updated from Supertest [supertest_read_write_api.test.ts] at [' + currentTime + ']';
    request(app)
      .put(`${API_ENDPOINT}/${maxTestTableId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: updatedDescription
      })
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          return done(err);
        }
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].description?.length).toBeGreaterThan(0);
        const returnedDescriptiion = res.body.results[0].description;
        expect(updatedDescription).toEqual(returnedDescriptiion);
        return done();
      });
  });

  test('TEST_TABLE DELETE request', (done) => {
    request(app)
      .delete(`${API_ENDPOINT}/${insertedId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          return done(err);
        }
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(insertedId);
        return done();
      });
  });

  //     __   ___  ___     __   ___  __        ___  __  ___  __
  //    / _` |__    |     |__) |__  /  \ |  | |__  /__`  |  /__`
  //    \__> |___   |     |  \ |___ \__X \__/ |___ .__/  |  .__/
  //
  test('GET: um_user_settings [admin]', (done) => {
    getRequestReturnsResult(done, `/um/settings/${username}`);
  });

  test('GET: category', (done) => {
    getRequestReturnsResult(done, '/category');
  });

  test('GET: store', (done) => {
    getRequestReturnsResult(done, '/store');
  });

  test('GET: sensitivity', (done) => {
    getRequestReturnsResult(done, '/sensitivity');
  });

  test('GET: variable_expenses', (done) => {
    getRequestReturnsResult(done, '/variable_expenses');
  });

  test('GET: investments', (done) => {
    getRequestReturnsResult(done, '/investments');
  });

  test('GET: investment_dividends', (done) => {
    getRequestReturnsResult(done, '/investment_dividends');
  });

  test('GET: fixed_costs', (done) => {
    getRequestReturnsResult(done, '/fixed_costs');
  });

  test('GET: fixed_income', (done) => {
    getRequestReturnsResult(done, '/fixed_income');
  });

  test('GET: food_prices_and_discounts', (done) => {
    getRequestReturnsResult(done, '/food_prices_and_discounts');
  });

  test('GET: discounted_foods_current', (done) => {
    getRequestReturnsResult(done, '/discounted_foods_current');
  });

  test('GET: sensitivities_of_purchase', (done) => {
    getRequestReturnsResult(done, '/sensitivities_of_purchase');
  });

  test('GET: category by ID', (done) => {
    getRequestByRandomIdMatches(done, '/category');
  });

  test('GET: store by ID', (done) => {
    getRequestByRandomIdMatches(done, '/store');
  });

  test('GET: sensitivity by ID', (done) => {
    getRequestByRandomIdMatches(done, '/sensitivity');
  });

  test('GET: variable_expenses by ID', (done) => {
    getRequestByRandomIdMatches(done, '/variable_expenses');
  });

  test('GET: fixed_costs by ID', (done) => {
    getRequestByRandomIdMatches(done, '/fixed_costs');
  });

  /**
   * since the all query and specific query use different database fields (id | sensitivity_id) we need a specific implementation
   */
  test('GET: sensitivities_of_purchase by sensitivity_id', (done) => {
    request(app)
      //   __        ___  __
      //  /  \ |  | |__  |__) \ /     /\  |    |
      //  \__X \__/ |___ |  \  |     /~~\ |___ |___
      .get(`${API_ENDPOINT}/sensitivities_of_purchase`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].sensitivity_id;
        request(app)
          //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
          //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
          //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
          .get(`${API_ENDPOINT}/sensitivities_of_purchase/sensitivity/${randomId}`)
          .set('Authorization', 'Bearer ' + authToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err: unknown, res: request.Response) => {
            if (err instanceof Error) return done(err);
            expect(res.body.results).toBeDefined();
            expect(res.body.results.length).toBeGreaterThan(0);
            const returnedId = res.body.results[0].sensitivity_id;
            expect(returnedId).toEqual(randomId);
            return done();
          });
      });
  });

  /**
   * since the all query and specific query use different database fields (id | variable_expense_id) we need a specific implementation
   */
  test('GET: sensitivities_of_purchase by variable_expense_id', (done) => {
    request(app)
      //   __        ___  __
      //  /  \ |  | |__  |__) \ /     /\  |    |
      //  \__X \__/ |___ |  \  |     /~~\ |___ |___
      .get(`${API_ENDPOINT}/sensitivities_of_purchase`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].variable_expense_id;
        request(app)
          //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
          //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
          //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
          .get(`${API_ENDPOINT}/sensitivities_of_purchase/var_expense/${randomId}`)
          .set('Authorization', 'Bearer ' + authToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err: unknown, res: request.Response) => {
            if (err instanceof Error) return done(err);
            expect(res.body.results).toBeDefined();
            expect(res.body.results.length).toBeGreaterThan(0);
            const returnedId = res.body.results[0].variable_expense_id;
            expect(returnedId).toEqual(randomId);
            return done();
          });
      });
  });

  /**
   * Queries variable expenses by given Category. The Category is randomized between test runs to guarantee the data is sound.
   */
  test('GET: variable_expenses by random category', (done) => {
    const VAR_EXPENSE_CATEGORIES = ['Groceries', 'Leisure', 'Sale', 'Hygiene', 'Gift'];
    request(app)
      .get(
        `${API_ENDPOINT}/variable_expenses/category/${VAR_EXPENSE_CATEGORIES[Math.floor(Math.random() * VAR_EXPENSE_CATEGORIES.length)]}`
      )
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  /**
   * get specific set collection of fixed income by date in the format 'yyyy-mm-dd'
   */
  test('GET: fixed_income by effective_date', (done) => {
    request(app)
      .get(`${API_ENDPOINT}/fixed_income/valid/${dbDateStr}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  /**
   * get specific set collection of fixed costs by date in the format 'yyyy-mm-dd'
   */
  test('GET: fixed_costs by effective_date', (done) => {
    request(app)
      .get(`${API_ENDPOINT}/fixed_costs/valid/${dbDateStr}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  test('GET: investments by ID', (done) => {
    getRequestByRandomIdMatches(done, '/investments');
  });

  test('GET: investment_dividends by ID', (done) => {
    getRequestByRandomIdMatches(done, '/investment_dividends');
  });
  //     __   __   __  ___     __   ___  __        ___  __  ___  __
  //    |__) /  \ /__`  |     |__) |__  /  \ |  | |__  /__`  |  /__`
  //    |    \__/ .__/  |     |  \ |___ \__X \__/ |___ .__/  |  .__/
  //

  test('POST user_settings: providing invalid username fails with 422 Unprocessable Content', (done) => {
    const userSettings: UserSettingObject = {
      username: '/(´ß!#',
      settingKey: 'selected_mode',
      settingValue: 'dark'
    };
    request(app)
      .post(`${API_ENDPOINT}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('POST user_settings: providing wrong setting_key fails', (done) => {
    const userSettings: UserSettingObject = {
      username: username,
      settingKey: 'not_defined',
      settingValue: 'dark'
    };
    request(app)
      .post(`${API_ENDPOINT}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('POST user_settings: providing not existing username fails', (done) => {
    const userSettings: UserSettingObject = {
      username: 'notExistingUser',
      settingKey: 'selected_mode',
      settingValue: 'light'
    };
    request(app)
      .post(`${API_ENDPOINT}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  //     __       ___     ___  ___  __        ___  __  ___  __
  //    |__) |  |  |     |__) |__  /  \ |  | |__  /__`  |  /__`
  //    |    \__/  |     |  \ |___ \__X \__/ |___ .__/  |  .__/
  //
  //     __   ___       ___ ___  ___        __   ___  __        ___  __  ___  __
  //    |  \ |__  |    |__   |  |__        |__) |__  /  \ |  | |__  /__`  |  /__`
  //    |__/ |___ |___ |___  |  |___       |  \ |___ \__X \__/ |___ .__/  |  .__/
  //
  /**
      _____ ______     __     ___ _   _ ____  _____ ____ _____ ___ ___  _   _
     |_   _/ ___\ \   / /    |_ _| \ | / ___|| ____|  _ \_   _|_ _/ _ \| \ | |
       | | \___ \\ \ / /      | ||  \| \___ \|  _| | |_) || |  | | | | |  \| |
       | |  ___) |\ V /       | || |\  |___) | |___|  _ < | |  | | |_| | |\  |
       |_| |____/  \_/       |___|_| \_|____/|_____|_| \_\|_| |___\___/|_| \_|*/

  // variable expenses
  test('TSV POST: variable_expenses and receive inserts', (done) => {
    const textTsv = `description	category	store	cost	purchasing_date	is_planned	contains_indulgence	sensitivities
    Softdrinks	Groceries	Edeka	€2.48	 28.04.2022	N	J	caffeine, aspartame/saccharin`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', textTsv, false);
  });

  test('POST TSV data: variable_expenses /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `description	category	store	cost	purchasing_date	is_planned	contains_indulgence	sensitivities	extra_column
    Softdrinks	Groceries	Edeka	€2.48	 28.04.2022	N	J	caffeine, aspartame/saccharin`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', textTsv, true);
  });

  test('POST TSV data: variable_expenses /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', '', true);
  });

  // fixed costs
  test('POST TSV data: fixed_costs and receive inserts', (done) => {
    const textTsv = `category	description	monthly_interval	billed_cost	monthly_cost	effective_date	expiration_date
      LIVING_ESSENTIALS 	Miete	1	360	360.00	01.06.2023	31.08.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', textTsv, false);
  });

  test('POST TSV data: fixed_costs /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `category	description	monthly_interval	billed_cost	monthly_cost	effective_date	expiration_date	extra_column
      LIVING_ESSENTIALS 	Miete	1	360	360.00	01.06.2023	31.08.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', textTsv, true);
  });

  test('POST TSV data: fixed_costs /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', '', true);
  });

  // fixed income
  test('POST TSV data: fixed_income and receive inserts', (done) => {
    const textTsv = `description	type	monthly_interval	value	effective_date	expiration_date
      Example Job Monthly Salary	net salary	1	3132.04	01.01.2024	01.01.4000`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', textTsv, false);
  });

  test('POST TSV data: fixed_income /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `description	type	monthly_interval	value	effective_date	expiration_date	extra_column
      Example Job Monthly Salary	net salary	1	3132.04	01.01.2024	01.01.4000`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', textTsv, true);
  });

  test('POST TSV data: fixed_income /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', '', true);
  });

  // new food items
  test('POST TSV data: new_food_items and receive inserts', (done) => {
    const textTsv = `food_item	brand	store	main_macro	kcal_amount	weight	price	last_update
      Oatly Cuisine 15%	Oatly	Alle	Fat	150	250	1.29	 31.07.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', textTsv, false);
  });

  test('POST TSV data: new_food_items /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `food_item	brand	store	main_macro	kcal_amount	weight	price	last_update	extra_column
      Oatly Cuisine 15%	Oatly	Alle	Fat	150	250	1.29	 31.07.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', textTsv, true);
  });

  test('POST TSV data: new_food_items /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', '', true);
  });

  // investments
  test('POST TSV data: investments and receive inserts', (done) => {
    const textTsv = `execution_type	description	isin	investment_type	marketplace	units	price_per_unit	total_price	fees	execution_date	pct_of_profit_taxed	profit_amt
      buy	CD PROJEKT S.A. C ZY 1	PLOPTTC00011	stock	Stuttgart	42	24.46	1043.11	15.79	22.01.2024		`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', textTsv, false);
  });

  test('POST TSV data: investments /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `execution_type	description	isin	investment_type	marketplace	units	price_per_unit	total_price	fees	execution_date	pct_of_profit_taxed	profit_amt	extra_column
      buy	CD PROJEKT S.A. C ZY 1	PLOPTTC00011	stock	Stuttgart	42	24.46	1043.11	15.79	22.01.2024		`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', textTsv, true);
  });

  test('POST TSV data: investments /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', '', true);
  });

  /**
      ____  ____      ____  _____ ____  ____ ___ ____ _____ ____
     |  _ \| __ )    |  _ \| ____|  _ \/ ___|_ _/ ___|_   _/ ___|
     | | | |  _ \    | |_) |  _| | |_) \___ \| |\___ \ | | \___ \
     | |_| | |_) |   |  __/| |___|  _ < ___) | | ___) || |  ___) |
     |____/|____/    |_|   |_____|_| \_\____/___|____/ |_| |____/*/

  test('DB_PERSIST POST user_settings: set dark mode for admin user expects 201 Created', (done) => {
    const userSettings: UserSettingObject = {
      username: username,
      settingKey: 'selected_mode',
      settingValue: 'dark'
    };
    request(app)
      .post(`${API_ENDPOINT}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201) // Created
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].username).toEqual(username);
        return done();
      });
  });

  test('DB_PERSIST POST /w db persist: new_food_item expects 201 Created', (done) => {
    const newFoodItem = {
      food_item: 'Hafermilch',
      brand: 'Oatly',
      store: 'Edeka',
      main_macro: 'Fat',
      kcal_amount: '63',
      weight: '1000',
      price: '2.39',
      last_update: currentDate
    };
    request(app)
      .post(`${API_ENDPOINT}/food_item`)
      .send(newFoodItem)
      .set('Authorization', 'Bearer ' + authToken)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedFoodItemDimensionKeys.push(Number(res.body.results[0].id));
        return done();
      });
  });

  test('DB_PERSIST POST /w db persist: attempt to save new_food_item twice expect 400 Bad Request', (done) => {
    const newFoodItem = {
      food_item: 'Heidelbeeren TK',
      brand: 'Freshona',
      store: 'Lidl',
      main_macro: 'Carbs',
      kcal_amount: '34',
      weight: '400',
      price: '1.79',
      last_update: currentDate
    };
    request(app)
      // post valid item
      .post(`${API_ENDPOINT}/food_item`)
      .send(newFoodItem)
      .set('Authorization', 'Bearer ' + authToken)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedFoodItemDimensionKeys.push(Number(res.body.results[0].id));
        request(app)
          // post item again. expect to violate unique key constraint
          .post(`${API_ENDPOINT}/food_item`)
          .send(newFoodItem)
          .set('Authorization', 'Bearer ' + authToken)
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err: unknown, _res: request.Response) => {
            if (err instanceof Error) return done(err);
            return done();
          });
      });
  });

  test('DB_PERSIST POST investments: persisting new BUY execution_type succeeds', (done) => {
    const ninetyDaysPrior = new Date(currentDate);
    ninetyDaysPrior.setDate(currentDate.getDate() - 90);
    const investmentAndTaxesObject: InvestmentAndTaxes = {
      execution_type: 'buy',
      description: 'CD PROJEKT S.A. INHABER-AKTIEN C ZY 1',
      isin: 'PLOPTTC00011',
      investment_type: 'stock',
      marketplace: 'Stuttgart',
      units: 42,
      price_per_unit: 24.46,
      total_price: 1043.11,
      fees: 15.79,
      execution_date: ninetyDaysPrior.toISOString(),
      pct_of_profit_taxed: 0,
      profit_amt: 0
    };
    request(app)
      .post(`${API_ENDPOINT}/investments`)
      .send(investmentAndTaxesObject)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].id).toBeDefined();
        purchasedInvestmentId = res.body.results[0].id;
        return done();
      });
  });

  test('DB_PERSIST POST investments: persisting new SELL execution_type succeeds', (done) => {
    const sixtyDaysPrior = new Date(currentDate);
    sixtyDaysPrior.setDate(currentDate.getDate() - 60);
    const investmentAndTaxesObject: InvestmentAndTaxes = {
      execution_type: 'sell',
      description: 'CD PROJEKT S.A. INHABER-AKTIEN C ZY 1',
      isin: 'PLOPTTC00011',
      investment_type: 'stock',
      marketplace: 'Stuttgart',
      units: 21,
      price_per_unit: 34.46,
      total_price: 1457.32,
      fees: 10.0,
      execution_date: sixtyDaysPrior.toISOString(),
      pct_of_profit_taxed: 0,
      profit_amt: 0
    };
    request(app)
      .post(`${API_ENDPOINT}/investments`)
      .send(investmentAndTaxesObject)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].id).toBeDefined();
        soldInvestmentId = res.body.results[0].id;
        return done();
      });
  });

  test('DB_PERSIST POST investment_dividends: persisting new dividend succeeds', (done) => {
    const dividendsObject = {
      isin: 'PLOPTTC00011',
      dividendAmount: 22.12,
      dividendDate: currentDate.toISOString(),
      pctOfProfitTaxed: 100.0,
      profitAmount: 22.12,
      investmentIdsAndRemainingUnits: [
        {
          investmentId: purchasedInvestmentId,
          remainingUnits: 21
        }
      ]
    };
    request(app)
      .post(`${API_ENDPOINT}/investment_dividends`)
      .send(dividendsObject)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].id).toBeDefined();
        addedDividendId = res.body.results[0].id;
        expect(res.body.taxesResults).toBeDefined();
        expect(res.body.taxesResults[0].id).toBeDefined();
        expect(res.body.bridgeResults).toBeDefined();
        expect(res.body.bridgeResults[0].id).toBeDefined();
        expect(res.body.bridgeResults[0].remaining_units).toBeDefined();
        return done();
      });
  });

  test('DB_PERSIST POST food_item_discount: persisting new discount succeeds', (done) => {
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(currentDate.getDate() + 7);
    const foodItemDiscountObj = {
      id: insertedFoodItemDimensionKeys[0],
      price: 1.49,
      startDate: currentDate.toISOString(),
      endDate: sevenDaysLater.toISOString()
    };
    request(app)
      .post(`${API_ENDPOINT}/food_item_discount`)
      .send(foodItemDiscountObj)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].id).toBeDefined();
        return done();
      });
  });

  test('DB_PERSIST POST food_item_discount: persisting new discount succeeds', (done) => {
    const oneDayPrior = new Date(currentDate);
    oneDayPrior.setDate(currentDate.getDate() - 1);
    const twelveDaysLater = new Date(currentDate);
    twelveDaysLater.setDate(currentDate.getDate() + 12);
    const foodItemDiscountObj = {
      id: insertedFoodItemDimensionKeys[0],
      price: 1.69,
      startDate: oneDayPrior.toISOString(),
      endDate: twelveDaysLater.toISOString()
    };
    request(app)
      .post(`${API_ENDPOINT}/food_item_discount`)
      .send(foodItemDiscountObj)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].id).toBeDefined();
        return done();
      });
  });

  test('DB_PERSIST PUT updated food price and expect it to succeed', (done) => {
    const updatedFoodPriceObj = {
      price: 2.25,
      lastUpdate: currentDate
    };
    request(app)
      .put(`${API_ENDPOINT}/food_item/price/${insertedFoodItemDimensionKeys[0]}`)
      .send(updatedFoodPriceObj)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const updatedId = Number(res.body.results[0].id);
        expect(updatedId).toEqual(insertedFoodItemDimensionKeys[0]);
        expect(!isNaN(Number(res.body.results[0].price))).toBeTruthy();
        const updatedPrice = Number(res.body.results[0].price);
        expect(updatedPrice).toEqual(updatedFoodPriceObj.price);
        return done();
      });
  });

  test('DB_PERSIST DELETE prior created food_item_discount expecting id returned', (done) => {
    request(app)
      .delete(`${API_ENDPOINT}/food_item_discount/${insertedFoodItemDimensionKeys[0]}/${currentDate.toISOString()}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(insertedFoodItemDimensionKeys[0]);
        return done();
      });
  });

  // THIS ALSO DELETES FOOD ITEM DISCOUNTS VIA delete_food_item_discount_trigger ON table_food_prices
  // so to test food item discount deletion, we have to call it before
  test('DB_PERSIST DELETE prior created food_items from db expecting ids returned', () => {
    const deleteRequests = insertedFoodItemDimensionKeys.map((insertedDimensionKey: number) => {
      return request(app)
        .delete(`${API_ENDPOINT}/food_item/${insertedDimensionKey}`)
        .set('Authorization', 'Bearer ' + authToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.results).toBeDefined();
          expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
          const deletedId = Number(res.body.results[0].id);
          expect(deletedId).toEqual(insertedDimensionKey);
        });
    });
    // wait for all delete requests to terminate before calling done on the test instance
    Promise.all(deleteRequests);
  });

  test('DB_PERSIST DELETE prior created dividend of investment, expecting id returned', (done) => {
    request(app)
      .delete(`${API_ENDPOINT}/investment_dividend/${addedDividendId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(addedDividendId);
        return done();
      });
  });

  test('DB_PERSIST DELETE prior created BUY investment, expecting id returned', (done) => {
    request(app)
      .delete(`${API_ENDPOINT}/investment/${purchasedInvestmentId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(purchasedInvestmentId);
        return done();
      });
  });

  test('DB_PERSIST DELETE prior created SELL investment, expecting id returned', (done) => {
    request(app)
      .delete(`${API_ENDPOINT}/investment/${soldInvestmentId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(soldInvestmentId);
        return done();
      });
  });

  test('DB_PERSIST DELETE delete_food_item_discount_trigger_function: Deleting a Food Item cascades to discounts.', async () => {
    // ADD NEW FOOD ITEM
    const newFoodItem = {
      food_item: '74% Intense',
      brand: 'Ritter Sport',
      store: 'Rewe',
      main_macro: 'Fat',
      kcal_amount: '672',
      weight: '100',
      price: '1.99',
      last_update: currentDate
    };
    const newFoodItemResponse = await request(app)
      .post(`${API_ENDPOINT}/food_item`)
      .send(newFoodItem)
      .set('Authorization', 'Bearer ' + authToken)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    expect(newFoodItemResponse.body.results).toBeDefined();
    expect(!isNaN(Number(newFoodItemResponse.body.results[0].id))).toBeTruthy();
    const insertedFoodItemId: number = Number(newFoodItemResponse.body.results[0].id);

    // ADD DISCOUNT OF NEW FOOD ITEM
    const threeDaysPrior = new Date(currentDate);
    threeDaysPrior.setDate(currentDate.getDate() - 3);
    const fourDaysLater = new Date(currentDate);
    fourDaysLater.setDate(currentDate.getDate() + 4);
    const foodItemDiscountObj = {
      id: insertedFoodItemId,
      price: 1.49,
      startDate: threeDaysPrior.toISOString(),
      endDate: fourDaysLater.toISOString()
    };
    const addDiscountResponse = await request(app)
      .post(`${API_ENDPOINT}/food_item_discount`)
      .send(foodItemDiscountObj)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201);
    expect(addDiscountResponse.body.results).toBeDefined();
    expect(addDiscountResponse.body.results[0].id).toBeDefined();
    const insertedDiscountId: number = addDiscountResponse.body.results[0].id;
    // Check for Discount ID added to be present in v_food_price_overview
    const checkCurrentDiscountsAfterInsert = await request(app)
      .get(`${API_ENDPOINT}/discounted_foods_current`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(checkCurrentDiscountsAfterInsert.body.results).toBeDefined();
    expect(checkCurrentDiscountsAfterInsert.body.results.length).toBeGreaterThan(0);
    const discountIdsAfterInsert: number[] = checkCurrentDiscountsAfterInsert.body.results.map((e: any) => e.id);
    expect(discountIdsAfterInsert.includes(insertedDiscountId)).toBeTruthy();

    // DELETE NEW FOOD ITEM AND EXPECT DISCOUNT TO BE DELETED BY TRIGGER
    const deleteFoodItemResponse = await request(app)
      .delete(`${API_ENDPOINT}/food_item/${insertedFoodItemId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(deleteFoodItemResponse.body.results).toBeDefined();
    expect(!isNaN(Number(deleteFoodItemResponse.body.results[0].id))).toBeTruthy();
    const deletedId = Number(deleteFoodItemResponse.body.results[0].id);
    expect(deletedId).toEqual(insertedFoodItemId);
    // Check for Discount ID of deleted food item to be absent in v_food_price_overview
    const checkCurrentDiscountsAfterDelete = await request(app)
      .get(`${API_ENDPOINT}/discounted_foods_current`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(checkCurrentDiscountsAfterDelete.body.results).toBeDefined();
    const discountIdsAfterDelete: number[] = checkCurrentDiscountsAfterDelete.body.results.map((e: any) => e.id);
    expect(discountIdsAfterDelete.includes(insertedDiscountId)).toBeFalsy();
  });
});

/**
 *
 * @param {jest.DoneCallback} done
 * @param {string} relativePath
 * @param {string} exampleTsv Tab Separated Value with Raw Data Example
 * @param {boolean} expectError
 */
function postTsvAndReceiveInsertStmt(
  done: jest.DoneCallback,
  relativePath: string,
  exampleTsv: string,
  expectError: boolean
) {
  request(app)
    .post(`${API_ENDPOINT}${relativePath}`)
    .send(exampleTsv)
    .set('Authorization', 'Bearer ' + authToken)
    .set('Content-Type', 'text/plain')
    .expect('Content-Type', expectError ? /json/ : /html/)
    .expect(expectError ? 400 : 200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      if (!expectError) {
        expect(res.text).toBeDefined();
        expect(res.text.length).toBeGreaterThan(0);
        expect(res.text.split('\n')[0]).toEqual('--[1] rows transformed into [1] INSERT STATEMENTS');
      }
      return done();
    });
}

/**
 * 1) Queries all data returned by given path
 * 2) Retrieves a random ID from returned data
 * 3) Queries specific id in another route and expects IDs to match.
 * @param {jest.DoneCallback} done
 * @param {string} relativePathAll
 * @param {string} relativePathSpecific optional path for specific query, only IF it diverges from relativePathAll
 * @param {boolean} expectMultiple optional flag specifying if multiple rows are expected as a result of querying a single id
 */
function getRequestByRandomIdMatches(
  done: jest.DoneCallback,
  relativePathAll: string,
  relativePathSpecific?: string,
  expectMultiple: boolean = false
) {
  request(app)
    //   __        ___  __
    //  /  \ |  | |__  |__) \ /     /\  |    |
    //  \__X \__/ |___ |  \  |     /~~\ |___ |___
    .get(`${API_ENDPOINT}${relativePathAll}`)
    .set('Authorization', 'Bearer ' + authToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      expect(res.body.results).toBeDefined();
      expect(res.body.results.length).toBeGreaterThan(0);
      const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].id;
      request(app)
        //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
        //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
        //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
        .get(`${API_ENDPOINT}${relativePathSpecific ? relativePathSpecific : relativePathAll}/${randomId}`)
        .set('Authorization', 'Bearer ' + authToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err: unknown, res: request.Response) => {
          if (err instanceof Error) return done(err);
          expect(res.body.results).toBeDefined();
          if (expectMultiple) {
            expect(res.body.results.length).toBeGreaterThan(0);
          } else {
            expect(res.body.results.length).toEqual(1);
          }
          const returnedId = res.body.results[0].id;
          expect(returnedId).toEqual(randomId);
          return done();
        });
    });
}

/**
 * Basic Request expecting db to return results with length > 0
 * @param done
 * @param {string} relativePath
 */
function getRequestReturnsResult(done: jest.DoneCallback, relativePath: string) {
  request(app)
    .get(`${API_ENDPOINT}${relativePath}`)
    .set('Authorization', 'Bearer ' + authToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      expect(res.body.results).toBeDefined();
      expect(res.body.results.length).toBeGreaterThan(0);
      return done();
    });
}
