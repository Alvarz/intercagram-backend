'use strict'
const { cleanObject, removeHiddenObject } = require('../helper/objects')
const { unAuth, success, error } = require('../helper/responses')
const to = require('../helper/to')
const User = require('../models/User')
const authService = require('../services/authService')
/** Class User controller. */
module.exports = class UserController {
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

    /** generate the token */
    let token = authService.generateToken(user, self.salt)
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
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next method
   * @return {promise}
   * */
  async verifyToken (req, res, next) {
    let [err, data] = await to(authService.verifyToken(req))
    if (err) { return unAuth('you are not allowes', res) }

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

    /** await resp.docs.forEach(async (user) => {
      await user.computeFollowing()
      await user.computeFollowers()
    }) */
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

    /** compute the followers of the user and the follwing by the user */
    await resp.computeFollowing()
    await resp.computeFollowers()
    /** clean the user of hidden elements and returns it */
    const cleaned = this.cleanObjectFromHidden(resp)
    return res.json(success('ok', cleaned))
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
