'use strict'

const { cleanObject } = require('../helper/objects')
const { success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Like = require('../models/Like')
/** Class Photo controller. */
module.exports = class LikeController {
  /*
   * the class constructor
   * */
  constructor () {
    console.log('constructor')
  }

  /*
   * to post data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */

  async postData (req, res) {
    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    req.body['user'] = resp.data
    console.log(req.body)

    const cleaned = cleanObject(req.body, Like.fillable)
    let [ero, created] = await to(Like.create(cleaned))
    if (ero) {
      console.error(ero)
      return res.json(error('there was an error', ero))
    }

    return res.json(success('Element was created', created))
  }

  /*
   * to delete data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async deleteData (req, res) {
    let picId = req.params.id

    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    const currentUserId = resp.data

    let [er, pic] = await to(Like.findOneAndDelete({ pic: picId, user: currentUserId }))
    if (er) {
      console.error(err)
      return res.json(error('there was an error', er))
    }

    return res.json(success('Element was removed', {}))
  }
}
