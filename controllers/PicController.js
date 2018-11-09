'use strict'

const { cleanObject } = require('../helper/objects')
const UploadService = require('../services/uploadService')
const { unAuth, success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Pic = require('../models/Pic')
/** Class Photo controller. */
module.exports = class PicController {
  /*
   * to fetch pics by given user
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchDataByUser (req, res) {
    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    const currentUserId = resp.data
    /** the user who own the pics */
    let userId = req.params.id
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [er, picsArray] = await to(Pic.paginate({ user: userId }, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (er) {
      console.error(er)
      return res.json(error('there was an error', er))
    }

    if (picsArray.docs.length > 0) {
      for (let key in picsArray.docs) {
        await picsArray.docs[key].userLiked(currentUserId)
      }
    }

    // await this.computeAllPicsAndComments(picsArray)
    return res.json(success('ok', picsArray))
  }

  /*
   * to fetch pics data
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchData (req, res) {
    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    const currentUserId = resp.data
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [er, picsArray] = await to(Pic.paginate({}, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (er) {
      console.error(er)
      return res.json(error('there was an error', er))
    }

    if (picsArray.docs.length > 0) {
      for (let key in picsArray.docs) {
        await picsArray.docs[key].userLiked(currentUserId)
      }
    }
    // await this.computeAllPicsAndComments(picsArray)

    return res.json(success('fetching data', picsArray))
  }

  /*
   * to get pic by given id
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async getData (req, res) {
    let id = req.params.id

    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }
    const currentUserId = resp.data

    let [er, pic] = await to(Pic.findById(id))
    if (er) {
      console.error(err)
      return res.json(error('there was an error', er))
    }

    await pic.userLiked(currentUserId)

    // await this.computeSingleLikesAndComments(pic)
    /** clean the user of hidden elements and returns it */
    return res.json(success('ok', pic))
  }

  /*
   * to post pic data
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
    const uploadServ = new UploadService()

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
