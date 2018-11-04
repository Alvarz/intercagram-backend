'use strict'

const { cleanObject } = require('../helper/objects')
const uploadService = require('../services/uploadService')
const { unAuth, success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Pic = require('../models/Pic')
/** Class Photo controller. */
module.exports = class PicController {
  /*
   * the class constructor
   * */
  constructor () {
    console.log('constructor')
  }

  /*
   * to fetch data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchDataByUser (req, res) {
    console.log('aca')
    /** the user who own the pics */
    let user_id = req.params.id
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [err, picsArray] = await to(Pic.paginate({ user: user_id }, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    // await this.computeAllPicsAndComments(picsArray)
    return res.json(success('ok', picsArray))
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
    let [err, picsArray] = await to(Pic.paginate({}, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    // await this.computeAllPicsAndComments(picsArray)

    return res.json(success('fetching data', picsArray))
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

    let [err, pic] = await to(Pic.findById(id))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    // await this.computeSingleLikesAndComments(pic)
    /** clean the user of hidden elements and returns it */
    return res.json(success('ok', pic))
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

    /** uploader instance */
    const uploadServ = new uploadService()

    /** upload all the pics */
    let [eror, uploaded] = await to(uploadServ.upload(req))
    if (eror) {
      console.error(eror)
      return res.json(error('there was an error', eror))
    }

    /**
     * for each pic uploaded, create an entry and
     * assign it to the user
     */
    for (let key in uploaded) {
      /** added the url to the pic */
      uploaded[key] = `${req.get('host')}${uploaded[key]}`
      /** get the data from the body */
      let body = req.body
      /** set the user_id from token response */
      body['user'] = resp.data
      /** get the url of data */
      body['url'] = uploaded[key]

      const cleaned = cleanObject(req.body, Pic.fillable)
      console.log(cleaned, 'cleaned')
      let [er, saved] = await to(Pic.create(cleaned))
      if (er) {
        console.error(er)
        return res.json(error('there was an error', er))
      }
    }

    return res.json(success('Element was created', uploaded))
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

  /*
   * compute the comments and likes of given pics
   * @async
   * @param {array} picsArray - the array to be computed
   * @return {promise}
   * */
  async computeAllPicsAndComments (picsArray) {
    const self = this

    if (picsArray.length < 1) { return [] }
    return picsArray.map(async (pic) => {
      let res = await self.computeSingleLikesAndComments(pic)
      return res
    })
  }

  /*
   * compute the comments and likes of given pic
   * @async
   * @param {Pic} picsArray - the pic to be computed
   * @return {promise}
   * */
  async computeSingleLikesAndComments (pic) {
    await pic.computeLikes()
    await pic.computeComments()
  }
}
