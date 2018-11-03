'use strict'
/** @module helper/responses.js */

/*
 * response with a success message
 * @param {string} the message
 * @param {object} the response data
 * @return {json}
 */
module.exports.success = (message, data) => {
  return buildMessage(message, data, true)
}

/*
 * response with a error message
 * @param {string} the message
 * @param {object} the response data
 * @return {json}
 */
module.exports.error = (message, error) => {
  return buildMessage(message, null, false, error)
}

/*
 * response with a success message
 * @param {string} the message
 * @param {object} the response data
 * @param {bool} the response data
 * @param {object} errors to retrieve
 * @return {json}
 */
const buildMessage = (_message, _data, _bool, _error = null) => {
  let resp = {
    message: _message,
    bool: _bool
  }

  /** if we have some data add it to the object */
  if (_data) { resp['data'] = _data }
  /** if we have some errors add it to the object */
  if (_error) { resp['error'] = _error }

  return resp
}
