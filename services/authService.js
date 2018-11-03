'use strict'

const jwt = require('jsonwebtoken')

module.exports = class authService {
  /*
   * the salt
   * @return {string}
   * */
  static get salt () {
    return 'thesaltcode'
  }
  /*
   * Route middleware to verify the auth token
   * @param {User} user - the request object
   * @return {string}
   * */
  static generateToken (user) {
    /** generate the jwt using standard algorithm and 1 hour expiration */
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: user._id
    }, this.salt)
  }

  /*
   * retrive the user id from the token
   * @param {object} token  - the request object
   * @return {object} response
   * */
  static getUserFromToken (req) {
    return this.verifyToken(req, true)
  }

  /*
   * Route middleware to verify the auth token
   * @param {object} req  - the request object
   * @param {bool} toGetId  - is to get id
   * @return {object}
   * */
  static verifyToken (req, toGetId = false) {
    let self = this
    return new Promise((resolve, reject) => {
    /** get the auth */
      let auth = req.headers.authorization
      /** if there is no auth, the request is not allowed */
      if (!auth) { reject('you are not allowed to see this page') }
      let chunks = auth.split(' ')
      /** if there is no propser chunks, the request is not allowed */
      if (chunks.length < 2 || chunks[0] !== 'Bearer') { reject('you are not allowed to see this page') }

      /** get the actual token */
      const token = chunks[1]

      // verify a token symmetric - synchronous
      jwt.verify(token, self.salt, (err, decoded) => {
        if (err) {
          reject(err)
        }

        if (!toGetId) {
          /** all was good carry on! (the user _id is in decoded.data ) */
          console.log(`${decoded.data} request was allowed on ${req.method}: ${req.originalUrl}`) // bar
        }

        resolve(decoded)
      })
    })
  }
}
