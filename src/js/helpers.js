// Imports
import { TIMEOUT_SEC } from './config.js';

// Timeout function that creates a new Promise and that is rejected after the inputed time has passed
const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took to long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};

// Function for making AJAX calls (getting and sending data)
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Conditionaly definin the 'fetchPromise' variable, depending on if 'uploadData' is defined or not
    const fetchPromise = uploadData
      ? fetch(url, {
          // Settings object for the 'fetch' API
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race(
      // Racing the fetch against the 'timeout' function
      // Promise.race returns the promise that is resolved first (either fullfilled or rejected)
      [fetchPromise, timeout(TIMEOUT_SEC)]
    );

    // Converting the data from JSON to JS Object
    const data = await response.json();

    // Guard clause in case the request is rejected
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    // Returning the recieved data
    return data;
  } catch (error) {
    // Re-throwing the error so it can be caught in the function calling this function
    throw error;
  }
};

/*
// Function that makes an AJAX call to the inputed URL and converts the recieved data from JSON
export const getJSON = async function (url) {
  try {
    // Making a new AJAX call
    const response = await Promise.race(
      // Racing the fetch against the 'timeout' function
      // Promise.race returns the promise that is resolved first (either fullfilled or rejected)
      [fetch(url), timeout(TIMEOUT_SEC)]
    );
    // Converting the data from JSON to JS Object
    const data = await response.json();

    // Guard clause in case the request is rejected
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    // Returning the recieved data
    return data;
  } catch (error) {
    // Re-throwing the error so it can be caught in the function calling this function
    throw error;
  }
};

// Function for sending data to an API
export const sendJSON = async function (url, uploadData) {
  try {
    // Sending data to an API
    const response = await Promise.race(
      // Racing the fetch against the 'timeout' function
      // Promise.race returns the promise that is resolved first (either fullfilled or rejected)
      [
        fetch(url, {
          // Settings object for the 'fetch' API
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        }),
        timeout(TIMEOUT_SEC),
      ]
    );
    // Converting the data from JSON to JS Object
    const data = await response.json();

    // Guard clause in case the request is rejected
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    // Returning the recieved data
    return data;
  } catch (error) {
    // Re-throwing the error so it can be caught in the function calling this function
    throw error;
  }
};
*/
