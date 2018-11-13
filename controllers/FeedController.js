'use strict'

const { unAuth, success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Pic = require('../models/Pic')
const Follow = require('../models/Follow')
const ObjectId = require('mongoose').Types.ObjectId
/**
  * @class Photo controller.
  * */
module.exports = class PicController {
  /*
   * to fetch the feed data of logged user
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchFeed (req, res) {
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 50

    /** the user who own the pics */
    let [eror, resp] = await to(authService.getUserFromToken(req))
    if (eror) {
      console.error(eror)
      return res.json(error('there was an error', eror))
    }

    let userId = resp.data

    /** the user who own the pics */
    let [er, followed] = await to(Follow.find({ follower: userId }))
    if (er) {
      console.error(er)
      return res.json(error('there was an error', er))
    }

    let follwedArr = []
    for (let f in followed) {
      if (followed[f].followed === null) continue

      follwedArr.push(new ObjectId(followed[f].followed._id))
    }

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    // let [err, picsArray] = await to(Pic.find({ user: follwedArr }))
    let [err, picsArray] = await to(Pic.paginate({ user: follwedArr }, { page: selectedPage,
      limit: limit,
      sort: 'createdAt'
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    if (picsArray.docs.length > 0) {
      for (let key in picsArray.docs) {
        await picsArray.docs[key].userLiked(userId)
      }
    }

    // await this.computeAllPicsAndComments(picsArray)
    return res.json(success('ok', picsArray))
  }
}
