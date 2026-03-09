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
      const id: number = request.body?.id;
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        response.status(422); // Unprocessable Content
        throw new Error('id request param should be a positive integer.');
      }
      // Replaces backslash with forward slash
      const filePath: string = request.file.path.replace(/\\/g, '/');
      const query = buildInsertFoodItemImgFilePath(id, filePath);
      const client = await pool.connect();
      try {
        logSqlStatement(query.text, query.values);
        const result = await client.query(query);
        if (result.rowCount == 1) {
          logger.info(`file successfully persisted in db for food item with id [${id}] in filepath: ' ${filePath} `);
          response.status(200).json({ filepath: filePath });
        } else {
          const errorMsg = 'Food item was not persisted successfully';
          logger.error(errorMsg);
          throw new Error(errorMsg);
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
  const filepath = request.params['filepath'];
  logger.http(`multerController received GET to /api/fiscalismia/public/img/uploads/${filepath}`);
  if (filepath.includes('/')) {
    const errorMsg = 'Array filepath received instead of string';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  const options = {
    root: path.join(__dirname, '../../', '/public/img/uploads/')
  };
  try {
    // Allows Cross Origin Resource Sharing specifically for the image.
    // Required in order to function with strict Helmet.JS Security Policies
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    response.sendFile(filepath as string, options, function (err) {
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
  if (!request.params.id || !Number.isInteger(Number(request.params.id)) || Number(request.params.id) <= 0) {
    response.status(422); // Unprocessable Content
    throw new Error('id request param should be a positive integer.');
  }
  const query = 'DELETE FROM food_price_image_location WHERE food_prices_dimension_key = $1 RETURNING filepath';
  const parameters = [request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(query, parameters);
    const results = { results: result ? result.rows : null };
    if (result.rows[0]?.filepath) {
      const filepath: string = result.rows[0].filepath;

      // Path traversal validation: resolve collapses ../ segments into a real absolute path.
      // Then we verify the result still lives inside the allowed upload directory.
      const allowedBaseDir = path.resolve(config.UPLOAD_IMG_RELATIVE_DIR);
      const resolvedPath = path.resolve(filepath);
      if (!resolvedPath.startsWith(allowedBaseDir + path.sep)) {
        logger.error(
          `Path traversal attempt blocked in DELETE for id [${request.params.id}], resolved: ${resolvedPath}`
        );
        response.status(400);
        throw new Error('Filepath does not resolve to the expected upload directory.');
      }
      await fs.promises.unlink(resolvedPath);
      logger.info(`${resolvedPath} was successfully DELETED.`);
      await client.query('COMMIT');
      response.status(200).json(results);
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
