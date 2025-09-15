const axios = require('axios');

/**
 * Fetches a buffer from a URL.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Buffer>}
 */
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (e) {
    console.error('getBuffer error:', e.message);
  }
};

/**
 * Gets group admins from participants array.
 * @param {Array} participants
 * @returns {Array}
 */
const getGroupAdmins = (participants) => {
  return participants.filter(p => p.admin !== null).map(p => p.id);
};

/**
 * Generates a random number with optional extension.
 * @param {string} ext
 * @returns {string}
 */
const getRandom = (ext = '') => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

/**
 * Converts number to human-readable format (K, M, B, etc.)
 * @param {number} num
 * @returns {string}
 */
const h2k = (num) => {
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const order = Math.floor(Math.log10(Math.abs(num)) / 3);
  if (order === 0) return num.toString();
  const unit = units[order];
  const scale = Math.pow(10, order * 3);
  let formatted = (num / scale).toFixed(1);
  if (/\.0$/.test(formatted)) formatted = formatted.slice(0, -2);
  return formatted + unit;
};

/**
 * Checks if a string is a valid URL.
 * @param {string} url
 * @returns {boolean}
 */
const isUrl = (url) => {
  const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
  return pattern.test(url);
};

/**
 * Pretty JSON stringify
 * @param {any} obj
 * @returns {string}
 */
const Json = (obj) => JSON.stringify(obj, null, 2);

/**
 * Converts seconds to human-readable runtime.
 * @param {number} seconds
 * @returns {string}
 */
const runtime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? `${d} day${d === 1 ? '' : 's'}, ` : '';
  const hDisplay = h > 0 ? `${h} hour${h === 1 ? '' : 's'}, ` : '';
  const mDisplay = m > 0 ? `${m} minute${m === 1 ? '' : 's'}, ` : '';
  const sDisplay = `${s} second${s === 1 ? '' : 's'}`;
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Sleep for given milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch JSON data from a URL.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<object>}
 */
const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    console.error('fetchJson error:', err.message);
    return null;
  }
};

/**
 * Checks if a number is decimal.
 * @param {number} number
 * @returns {boolean}
 */
const isDecimal = (number) => !Number.isInteger(number);

module.exports = {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  isDecimal
};const axios = require('axios');

/**
 * Fetches a buffer from a URL.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Buffer>}
 */
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (e) {
    console.error('getBuffer error:', e.message);
  }
};

/**
 * Gets group admins from participants array.
 * @param {Array} participants
 * @returns {Array}
 */
const getGroupAdmins = (participants) => {
  return participants.filter(p => p.admin !== null).map(p => p.id);
};

/**
 * Generates a random number with optional extension.
 * @param {string} ext
 * @returns {string}
 */
const getRandom = (ext = '') => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

/**
 * Converts number to human-readable format (K, M, B, etc.)
 * @param {number} num
 * @returns {string}
 */
const h2k = (num) => {
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const order = Math.floor(Math.log10(Math.abs(num)) / 3);
  if (order === 0) return num.toString();
  const unit = units[order];
  const scale = Math.pow(10, order * 3);
  let formatted = (num / scale).toFixed(1);
  if (/\.0$/.test(formatted)) formatted = formatted.slice(0, -2);
  return formatted + unit;
};

/**
 * Checks if a string is a valid URL.
 * @param {string} url
 * @returns {boolean}
 */
const isUrl = (url) => {
  const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
  return pattern.test(url);
};

/**
 * Pretty JSON stringify
 * @param {any} obj
 * @returns {string}
 */
const Json = (obj) => JSON.stringify(obj, null, 2);

/**
 * Converts seconds to human-readable runtime.
 * @param {number} seconds
 * @returns {string}
 */
const runtime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? `${d} day${d === 1 ? '' : 's'}, ` : '';
  const hDisplay = h > 0 ? `${h} hour${h === 1 ? '' : 's'}, ` : '';
  const mDisplay = m > 0 ? `${m} minute${m === 1 ? '' : 's'}, ` : '';
  const sDisplay = `${s} second${s === 1 ? '' : 's'}`;
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Sleep for given milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch JSON data from a URL.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<object>}
 */
const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    console.error('fetchJson error:', err.message);
    return null;
  }
};

/**
 * Checks if a number is decimal.
 * @param {number} number
 * @returns {boolean}
 */
const isDecimal = (number) => !Number.isInteger(number);

module.exports = {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  isDecimal
};
