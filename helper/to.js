'use strict'
/** @module helper/to.js */
/*
 * helper to avoy try catch of hell on asyn await
 * @param {promise} the promise to be solved
 * @ {object}
 */
module.exports = function to (promise) {
  return promise.then(data => {
    return [null, data]
  })
    .catch(err => [err])
}
