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

/**
 * clean the object to be updated due model
 * @param {object} data .
 * @param {array} hidden .
 * @return {object} .
 */
module.exports.removeHiddenObject = (data, hidden) => {
  let newObject = {}
  Object.keys(data).forEach((key) => {
    if (!hidden.includes(key)) { newObject = Object.assign(newObject, { [key]: data[key] }) }
  })
  return newObject
}
