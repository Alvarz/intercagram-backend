'use strict'

const { cleanObject } = require('../helper/objects')
const { success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Comment = require('../models/Comment')

/**
  * @class  Comment controller.
  * */
module.exports = class CommentController {
  /*
   * to fetch data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchData (req, res) {
    return res.json({ message: 'fetching data' })
  }

  /*
   * to get data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async getData (req, res) {
    return res.json({ message: 'getting data' })
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

    const cleaned = cleanObject(req.body, Comment.fillable)
    let [ero, created] = await to(Comment.create(cleaned))
    if (ero) {
      console.error(ero)
      return res.json(error('there was an error', ero))
    }

    return res.json(success('Element was created', created))
  }

  /*
   * to put data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async putData (req, res) {
    return res.json({ message: 'updating data' })
  }

  /*
   * to delete data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async deleteData (req, res) {
    return res.json({ message: 'removing data' })
  }
}
