const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
import { Request, Response } from 'express';
const { pool } = require('../utils/pgDbService');
const config = require('../utils/config');
const path = require('path');
const fs = require('fs');
const { buildInsertFoodItemImgFilePath, logSqlStatement } = require('../utils/SQL_UTILS');

/**
 * @description user uploading a single food item image to the server
 * <input type="file" name="foodItemImg" /> in request.file with the following fields available:
 * - fieldname | originalname | encoding | mimetype | size | destination | path | buffer
 * <input type="text" name="imgMetaData" /> in request.body.imgMetaData
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/upload/food_item_img
 */
const postFoodItemImg = asyncHandler(async (request: Request, response: Response) => {
  logger.http('multerController received POST to /api/fiscalismia/upload/food_item_img');
  try {
    if (request.file?.path) {
      // Replaces backslash with forward slash
      const filePath = request.file.path.replace(/\\/g, '/');
      const element = {
        id: request.body?.id,
        filepath: filePath
      };
      const sql = buildInsertFoodItemImgFilePath(element);
      const parameters = '';
      const client = await pool.connect();
      try {
        logSqlStatement(sql, parameters);
        const result = await client.query(sql, parameters);
        if (result.rowCount == 1) {
          logger.info(
            `file successfully persisted in db for food item with id [${element.id}] in filepath: ' ${element.filepath} `
          );
          response.status(200).send(filePath);
        } else {
          throw new Error();
        }
      } catch (error: unknown) {
        response.status(400);
        if (error instanceof Error) {
          error.message = `INSERT of filepath into food_price_image_location failed. ${error.message}`;
        }
        throw error;
      } finally {
        client.release();
      }
    }
    if (request.body?.imgMetaData) {
      logger.debug('Image Metadata received: ' + request.body.imgMetaData);
    }
  } catch (error: unknown) {
    response.status(409);
    if (error instanceof Error) {
      error.message = `Image upload to /api/fiscalismia/upload/food_item_img has encountered an error: \n ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description fetching food item image from server's filesystem
 * @method HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/public/img/uploads/:filepath
 */
const getFoodItemImg = asyncHandler(async (request: Request, response: Response, next: any) => {
  const filepath = request.params.filepath;
  logger.http(`multerController received GET to /api/fiscalismia/public/img/uploads/${filepath}`);
  const options = {
    root: path.join(__dirname, '../../', '/public/img/uploads/')
  };
  try {
    // Allows Cross Origin Resource Sharing specifically for the image.
    // Required in order to function with strict Helmet.JS Security Policies
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    response.sendFile(filepath, options, function (err) {
      if (err) {
        next(err);
      }
    });
    response.status(200);
    logger.info(`File sent in response. Location: ${config.ROOT_URL}/public/img/uploads/${filepath}`);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `GET request to fetch food item image has failed. \n ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description 0) receives food item id to delete in REST call
 * 1 ) Deletes filepath row from db table food_price_image_location
 * 2) on Success unlinks (deletes) file from server file system
 * 3) returns filepath succesfully deleted for user notification
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/public/img/uploads/:id
 */
const deleteFoodItemImg = asyncHandler(async (request: Request, response: Response) => {
  logger.http('multerController received DELETE to /api/fiscalismia/public/img/uploads/' + request.params.id);
  const sql = 'DELETE FROM food_price_image_location WHERE food_prices_dimension_key = $1 RETURNING filepath';
  const parameters = [request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(sql, parameters);
    if (result.rows[0]?.filepath) {
      const results = { results: result ? result.rows : null };
      fs.unlink(result.rows[0].filepath, (err: unknown) => {
        if (err instanceof Error) {
          logger.error('Server Filesystem Image deletion failed');
        } else {
          logger.info(`${result.rows[0].filepath} was successfully DELETED.`);
        }
      });
      await client.query('COMMIT');
      response.status(200).send(results);
    } else {
      throw Error('Deletion query has not returned expected deleted filepath variable from db.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from food_price_image_location. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  postFoodItemImg,
  getFoodItemImg,
  deleteFoodItemImg
};
