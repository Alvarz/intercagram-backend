'use strict'

const chai = require('chai')
const spies = require('chai-spies')
let LikeController = require('../controllers/LikeController')
const Like = require('../models/Like')
const authService = require('../services/authService')
const expect = require('chai').expect
chai.use(spies)

/** some vars */
let likeCtrl, createSpy, deleteSpy

/** res mock */
let res = {
  json: (data) => {
    return data
  }
}

/** req mock */
let req = {
  data: '5be70c558ea4a431244080c2',
  body: { likeer: '5be70c558ea4a431244080c2' },
  params: { id: '5be70c558ea4a431244080c2' }
}

/** mock token reciever */
authService.getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    resolve(req)
  })
}

/** mock delete many */
Like.findOneAndDelete = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}
/** mock like */
Like.create = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}

beforeEach(() => {
  /** Clear the cache, this can be done in a way described in the example repo. Does not have to happen here */
  delete require.cache[require.resolve('../controllers/LikeController')]

  /** Update our reference, this needs to happen here */
  LikeController = require('../controllers/LikeController')

  likeCtrl = new LikeController()

  createSpy = chai.spy(Like.create)
  Like.create = createSpy

  deleteSpy = chai.spy(Like.findOneAndDelete)
  Like.findOneAndDelete = deleteSpy
})

describe('[LikeController]', () => {
  it('like user ', async (done) => {
    likeCtrl.postData(req, res).then(() => {
      expect(createSpy).to.be.called()
      expect(Like.create).to.be.spy
    }).catch()
    done()
  })

  it('unlike user ', async (done) => {
    likeCtrl.deleteData(req, res).then(() => {
      expect(deleteSpy).to.be.called()
      expect(Like.findOneAndDelete).to.be.spy
    }).catch()
    done()
  })
})
