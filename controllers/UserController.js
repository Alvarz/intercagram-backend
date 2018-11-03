'use strict'
const { cleanObject } = require('../helper/objects')
const { success, error } = require('../helper/responses')
const to = require('../helper/to')
const User = require('../models/User')

/** Class User controller. */
module.exports = class UserController {
  /*
   * the class constructor
   * */
  constructor () {
    console.log('constructor')
  }

  async signin (req, res) {
    let credentials = {
      user: req.body.user,
      password: req.body
    }
  }

  /*
   * to fetch data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchData (req, res) {
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [err, resp] = await to(User.paginate({}, { page: selectedPage, limit: limit }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    return res.json(success('fetching data', resp))
  }

  /*
   * to get data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async getData (req, res) {
    let id = req.params.id

    let [err, resp] = await to(User.findById(id))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    return res.json(success('getting data', resp))
  }

  /*
   * to post data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async postData (req, res) {
    const cleaned = cleanObject(req.body, User.fillable)
    let [err, resp] = await to(User.create(cleaned))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    return res.json(success('Element was created', resp))
  }

  /*
   * to put data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async putData (req, res) {
    let id = req.params.id
    const cleaned = cleanObject(req.body, User.fillable)
    let [err, resp] = await to(User.findByIdAndUpdate(id, cleaned, { new: true }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    return res.json(success('Element was updated', resp))
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
