'use strict'

const UserCtrl = require('../controllers/UserController')
const PicCtrl = require('../controllers/PicController')
const CommentCtrl = require('../controllers/PicController')

/** Class Main system router. */
module.exports = class router {
  /*
   * the app constructor
   * @param {express} app instance
   * */
  constructor (app) {
    this.router = app
    this.userCtrl = new UserCtrl()
    this.picCtrl = new PicCtrl()
    this.commentCtrl = new CommentCtrl()
  }

  /*
   * the main router application
   * @return {object}
   * */
  routes () {
    this.router.post('/signin', this.userCtrl.signin)
    /** users related routes */
    this.router.get('/users', this.userCtrl.fetchData)
    this.router.get('/users/:id', this.userCtrl.getData)
    this.router.post('/users', this.userCtrl.postData)
    this.router.put('/users/:id', this.userCtrl.putData)
    this.router.delete('/users/:id', this.userCtrl.deleteData)

    /** photo related routes */
    this.router.get('/pics', this.picCtrl.fetchData)
    this.router.get('/pics/:id', this.picCtrl.getData)
    this.router.post('/pics', this.picCtrl.postData)
    this.router.put('/pics/:id', this.picCtrl.putData)
    this.router.delete('/pics/:id', this.picCtrl.deleteData)

    /** photo related routes */
    this.router.get('/comments', this.commentCtrl.fetchData)
    this.router.get('/comments/:id', this.commentCtrl.getData)
    this.router.post('/comments', this.commentCtrl.postData)
    this.router.put('/comments/:id', this.commentCtrl.putData)
    this.router.delete('/comments/:id', this.commentCtrl.deleteData)

    return this.router
  }
}
