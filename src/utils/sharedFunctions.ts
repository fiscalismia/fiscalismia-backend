const { parse } = require('csv-parse/sync');
//  _____ _   _   ___  ______ ___________      ______ _   _ _   _ _____ _____ _____ _____ _   _  _____
// /  ___| | | | / _ \ | ___ \  ___|  _  \     |  ___| | | | \ | /  __ \_   _|_   _|  _  | \ | |/  ___|
// \ `--.| |_| |/ /_\ \| |_/ / |__ | | | |     | |_  | | | |  \| | /  \/ | |   | | | | | |  \| |\ `--.
//  `--. \  _  ||  _  ||    /|  __|| | | |     |  _| | | | | . ` | |     | |   | | | | | | . ` | `--. \
// /\__/ / | | || | | || |\ \| |___| |/ /      | |   | |_| | |\  | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
// \____/\_| |_/\_| |_/\_| \_\____/|___/       \_|    \___/\_| \_/\____/ \_/  \___/ \___/\_| \_/\____/

export const usernameRegExp = /^[a-zA-Z0-9_]{3,32}$/;
export const regExAlphaNumeric = /^[a-zA-Z0-9._-]*$/;
export const regExEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const replaceCommaAndParseFloat = (input: string) => {
  return parseFloat(input.replace(/,/g, '.').replace(/[^\d.-]/g, ''));
};

export const getLocalTimestamp = () => {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Berlin' // Timezone for Germany
  });
  const date = new Date(now);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * returning an object with parsed header values from the first line out of Frontend within request.body.
 * @param requestBody
 * @returns
 */
export const parseHeader = (requestBody: string) => {
  return parse(requestBody, {
    columns: true, // automatically detect provided headers from first line
    delimiter: '\t',
    to: 1 // stop after first line to only determine headers
  });
};

/**
 * check if headers provided in frontend match the expectation.
 * @param providedHeaders string array of header names from TSV import
 * @param expectedHeaders string array of header names defined in calling method
 */
export const headersAsExpected = (providedHeaders: string[], expectedHeaders: string[]) => {
  if (providedHeaders.toString() !== expectedHeaders.toString()) {
    throw new Error('The expected columns were not provided. Expected: ' + expectedHeaders.toString());
  }
};

/**
 * extracts header keynames from returned result of csv-parse
 * @param result result of csv-parse
 * @returns empty array for empty result or array of objects keynames (headers)
 */
export const extractResultHeaders = (result: any) => {
  return result && result.length > 0 ? Object.keys(result[0]) : [];
};
