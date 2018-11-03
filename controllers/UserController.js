'use strict'
const { cleanObject, removeHiddenObject } = require('../helper/objects')
const { unAuth, success, error } = require('../helper/responses')
const to = require('../helper/to')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
/** Class User controller. */
module.exports = class UserController {
  constructor () {
    this.salt = 'thesaltcode'
  }
  /*
   * Login and generate the jwt
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async signin (req, res) {
    let self = this
    /** create the credentials object */
    let credentials = {
      email: req.body.email,
      password: req.body.password
    }

    /** get the user */
    let [err, resp] = await to(User.find(credentials))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    const user = resp[0]

    /** if there is no user, wrong credentials */
    if (!user) { return res.json(error('Wrong signup credentials', {})) }

    /** generate the jwt using standard algorithm and 1 hour expiration */
    let token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: user._id
    }, self.salt)

    /** set the jwt header to the response */
    res.set({ 'x-access-token': token })

    /** update the token on users model */
    let [errors, response] = await to(User.findByIdAndUpdate(user._id, { token: token }, { new: true }))
    if (errors) {
      console.error(errors)
      return res.json(error('there was an error', errors))
    }

    /** clean the user of hidden elements and returns it */
    const cleaned = this.cleanObjectFromHidden(user)
    return res.json(success('login succefully', cleaned))
  }

  /*
   * Route middleware to verify the auth token
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next method
   * @return {promise}
   * */
  verifyToken (req, res, next) {
    /** get the auth */
    let auth = req.headers.authorization
    /** if there is no auth, the request is not allowed */
    if (!auth) { return unAuth('you are not allowed to see this page', res) }
    let chunks = auth.split(' ')
    /** if there is no propser chunks, the request is not allowed */
    if (chunks.length < 2 || chunks[0] !== 'Bearer') { return unAuth('you are not allowed to see this page', res) }

    /** get the actual token */
    const token = chunks[1]

    // verify a token symmetric - synchronous
    jwt.verify(token, this.salt, (err, decoded) => {
      if (err) {
        console.error(err)
        return unAuth('you are not allowed to see this page', res)
      }
      /** all was good carry on! (the user _id is in decoded.data ) */
      console.log(`${decoded.data} request was allowed on ${req.method}: ${req.url}`) // bar
    })
    /** call the next middleware */
    next()
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
    /** clean all users from hidden fields */
    resp.docs = this.cleanAllElements(resp.docs)
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
    /** clean the user of hidden elements and returns it */
    const cleaned = this.cleanObjectFromHidden(resp)
    return res.json(success('login succefully', cleaned))
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

  /*
   * clean all elements from hidden
   * @param {array} users - the user data
   * @return {array}
   * */
  cleanAllElements (users) {
    const self = this
    return users.map((user) => {
      return self.cleanObjectFromHidden(user)
    })
  }

  /*
   * clean the model from unused data
   * @async
   * @param {User} user - the user data
   * @return {object}
   * */
  cleanObjectFromHidden (user) {
    return removeHiddenObject(user.toObject(), User.hidden)
  }
}
