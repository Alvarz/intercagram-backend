'use strict'

const chai = require('chai')
const spies = require('chai-spies')
let CommentController = require('../controllers/CommentController')
const Comment = require('../models/Comment')
const authService = require('../services/authService')
const expect = require('chai').expect
chai.use(spies)

let commentCtrl, postSpy
/** res mock */
let res = {
  json: (data) => {
    return data
  }
}

/** req mock */
let req = {
  data: '1237281812368127',
  body: {
    name: 'testname',
    lastname: 'lastname',
    nickname: 'nickname',
    email: 'email@email.com',
    password: 'password'
  }
}

/** mock token reciever */
authService.getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    resolve(req)
  })
}
/** mock create */
Comment.create = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}

beforeEach(() => {
// Clear the cache, this can be done in a way described in the example repo. Does not have to happen here
  delete require.cache[require.resolve('../controllers/CommentController')]

  // Update our reference, this needs to happen here
  CommentController = require('../controllers/CommentController')

  commentCtrl = new CommentController()
  postSpy = chai.spy(commentCtrl.postData)
  commentCtrl.postData = postSpy
})

describe('[CommentController]', () => {
  it('fetch data ', async (done) => {
    commentCtrl.fetchData(req, res)
    done()
  })

  it('get data ', async (done) => {
    commentCtrl.getData(req, res)
    done()
  })

  it('put data ', async (done) => {
    commentCtrl.putData(req, res)
    done()
  })

  it('delete data ', async (done) => {
    commentCtrl.deleteData(req, res)
    done()
  })

  it('post data ', async (done) => {
    commentCtrl.postData(req, res)
    expect(postSpy).to.be.called()
    expect(commentCtrl.postData)
    done()
  })
})
