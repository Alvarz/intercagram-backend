'use strict'

const { cleanObject } = require('../helper/objects')
const { success, error } = require('../helper/responses')
const authService = require('../services/authService')
const to = require('../helper/to')
const Follow = require('../models/Follow')
/** Class Photo controller. */
module.exports = class FollowController {
  /*
   * to fetch followinda data of logged user
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchFollowing (req, res) {
    /** search the user id information on the token */
    let [er, resp] = await to(authService.getUserFromToken(req))
    if (er) {
      console.error(er)
      return res.json(error('there was an error', er))
    }
    const currentUserId = resp.data
    /** the user who own the pics */
    let userId = req.params.user_id
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [err, fArray] = await to(Follow.paginate({ follower: userId }, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    if (fArray.docs.length > 0) {
      for (let key in fArray.docs) {
        await fArray.docs[key].userFollowFollwing(currentUserId)
        await fArray.docs[key].userFollowFollowers(currentUserId)
      }
    }

    // await this.computeAllFollowsAndComments(picsArray)
    return res.json(success('ok', fArray))
  }
  /*
   * to fetch followers data of logged users
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async fetchFollowers (req, res) {
    let [er, resp] = await to(authService.getUserFromToken(req))
    if (er) {
      console.error(er)
      return res.json(error('there was an error', er))
    }
    const currentUserId = resp.data
    /** the user who own the pics */
    let userId = req.params.user_id
    /** Access the provided 'page' and 'limt' query parameters */
    let selectedPage = req.query.page
    let limit = req.query.limit || 10

    /** validate page is not < than 0 */
    if (selectedPage < 1) { selectedPage = 1 }

    /* fetch users paginated */
    let [err, fArray] = await to(Follow.paginate({ followed: userId }, { page: selectedPage,
      limit: limit
      // populate: { path: 'user', select: ['name', 'lastname', 'nickname', 'email'] }
    }))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    if (fArray.docs.length > 0) {
      for (let key in fArray.docs) {
        await fArray.docs[key].userFollowFollwing(currentUserId)
        await fArray.docs[key].userFollowFollowers(currentUserId)
      }
    }
    // await this.computeAllFollowsAndComments(picsArray)
    return res.json(success('ok', fArray))
  }

  /*
   * to follow a user
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async followUser (req, res) {
    /** search the user id information on the token */
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    req.body['follower'] = resp.data
    console.log(req.body)

    const cleaned = cleanObject(req.body, Follow.fillable)
    let [ero, created] = await to(Follow.create(cleaned))
    if (ero) {
      console.error(ero)
      return res.json(error('there was an error', ero))
    }

    return res.json(success('Element was created', created))
  }

  /*
   * to unfollow a user
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {promise}
   * */
  async unfollowUser (req, res) {
    let [err, resp] = await to(authService.getUserFromToken(req))
    if (err) {
      console.error(err)
      return res.json(error('there was an error', err))
    }

    let userId = req.params.user_id
    /** search the user id information on the token */
    const follower = resp.data

    const [ero, respo] = await to(Follow.deleteMany({ follower: follower, followed: userId }))
    if (ero) {
      console.error(ero)
      return res.json(error('there was an error', ero))
    }
    return res.json(success('You unfollow succefully'))
  }
}
