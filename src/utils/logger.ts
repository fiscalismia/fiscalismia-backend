import { createLogger, format, transports } from 'winston';
const { getLocalTimestamp } = require('./sharedFunctions');
const colorizer = format.colorize();
/**
 * @description
 */
const logger = createLogger({
  level: 'info', // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
  format: format.combine(
    format.timestamp({
      format: getLocalTimestamp
    }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message ? (typeof info.message === 'string' ? info.message.trim() : String(info.message ?? '')) : null}`
    )
  ),
  // defaultMeta: { service: 'user-service' }, // define own metadata to be added
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `info.log`
    // - Write all logs with importance level of `debug` or less to `debug.log`
    //
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/debug.log', level: 'debug' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug', // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
      format: format.combine(
        format.timestamp({
          format: getLocalTimestamp
        }),
        format.colorize({
          level: true,
          message: false,
          // Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
          // Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
          // Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
          colors: {
            info: 'bold blue blackBG',
            warn: 'italic yellow',
            error: 'bold red',
            http: 'inverse italic grey',
            verbose: 'dim gray',
            timestamp: 'dim green blackBG'
          }
        }),
        format.printf(
          (info) =>
            `${info.level}: ${info.message ? (typeof info.message === 'string' ? info.message.trim() : String(info.message ?? '')) : null} at ${colorizer.colorize('timestamp', info['timestamp'] as string)}`
        )
      )
    })
  );
}

module.exports = logger;
export {}; // disables tslint error: Cannot redeclare block-scoped variable 'logger'
