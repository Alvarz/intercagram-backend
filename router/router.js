'use strict'

const UserCtrl = require('../controllers/UserController')
const PicCtrl = require('../controllers/PicController')
const CommentCtrl = require('../controllers/PicController')
const LikeCtrl = require('../controllers/LikeController')

/** Class Main system router. */
module.exports = class router {
  /*
   * the app constructor
   * @param {express} app instance
   * */
  constructor (express, app) {
    this.router = express.Router()
    this.userCtrl = new UserCtrl()
    this.picCtrl = new PicCtrl()
    this.commentCtrl = new CommentCtrl()
    this.likeCtrl = new LikeCtrl()
    this.router.use('/api', this.userCtrl.verifyToken.bind(this.userCtrl))
  }

  /*
   * the main router application
   * @return {object}
   * */
  routes () {
    /** users related routes */
    this.router.get('/api/users', this.userCtrl.fetchData.bind(this.userCtrl))
    this.router.get('/api/users/:id', this.userCtrl.getData.bind(this.userCtrl))
    this.router.post('/api/users', this.userCtrl.postData.bind(this.userCtrl))
    this.router.put('/api/users/:id', this.userCtrl.putData.bind(this.userCtrl))
    this.router.delete('/api/users/:id', this.userCtrl.deleteData.bind(this.userCtrl))

    /** Like related routes */
    this.router.post('/api/pics/like', this.likeCtrl.postData.bind(this.likeCtrl))
    /** photo related routes */
    this.router.get('/api/users/:id/pics', this.picCtrl.fetchDataByUser.bind(this.picCtrl))
    this.router.get('/api/pics/:id', this.picCtrl.getData.bind(this.picCtrl))
    this.router.get('/api/pics', this.picCtrl.fetchData.bind(this.picCtrl))
    this.router.post('/api/pics', this.picCtrl.postData.bind(this.picCtrl))
    this.router.put('/api/pics/:id', this.picCtrl.putData.bind(this.picCtrl))
    this.router.delete('/api/pics/:id', this.picCtrl.deleteData.bind(this.picCtrl))

    /** comment related routes */
    this.router.get('/api/comments', this.commentCtrl.fetchData.bind(this.commentCtrl))
    this.router.get('/api/comments/:id', this.commentCtrl.getData.bind(this.commentCtrl))
    this.router.post('/api/comments', this.commentCtrl.postData.bind(this.commentCtrl))
    this.router.put('/api/comments/:id', this.commentCtrl.putData.bind(this.commentCtrl))
    this.router.delete('/api/comments/:id', this.commentCtrl.deleteData.bind(this.commentCtrl))

    this.router.post('/signin', this.userCtrl.signin.bind(this.userCtrl))
    return this.router
  }
}
