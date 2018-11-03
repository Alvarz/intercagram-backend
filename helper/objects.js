'use strict'
/** @module utils/objects */

/**
 * clean the object to be updated due model
 * @param {object} data .
 * @param {array} fillables .
 * @return {object} .
 */
module.exports.cleanObject = (data, fillable) => {
  let newObject = {}
  Object.keys(data).forEach((key) => {
    if (fillable.includes(key)) { newObject = Object.assign(newObject, { [key]: data[key] }) }
  })
  return newObject
}
