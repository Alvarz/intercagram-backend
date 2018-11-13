'use strict'

const chai = require('chai')
const spies = require('chai-spies')
let FeedController = require('../controllers/FeedController')
const Follow = require('../models/Follow')
const Pic = require('../models/Pic')
const authService = require('../services/authService')
const expect = require('chai').expect
chai.use(spies)

/** some vars */
let feedCtrl, feedSpy

/** res mock */
let res = {
  json: (data) => {
    return data
  }
}

/** req mock */
let req = {
  data: '5be70c558ea4a431244080c2',
  query: {
    page: 1
  }
}

/** mock token reciever */
authService.getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    resolve(req)
  })
}
/** mock find */
Follow.find = (object) => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        follower: '5be70c558ea4a431244080c2',
        followed: '5be70c558ea4a431244080c2'
      },
      {
        follower: '5be70c558ea4a431244080c2',
        followed: '5be70c558ea4a431244080c2'
      }
    ])
  })
}
/** mock paginate */
Pic.paginate = (object, object2) => {
  return new Promise((resolve, reject) => {
    resolve({ docs: [{ url: 'pic.jpg', likes: 1, userLiked: () => {} }, { url: 'pic.jpg', likes: 1, userLiked: () => {} }] })
  })
}

beforeEach(() => {
  /** Clear the cache, this can be done in a way described in the example repo. Does not have to happen here */
  delete require.cache[require.resolve('../controllers/FeedController')]

  /** Update our reference, this needs to happen here */
  FeedController = require('../controllers/FeedController')

  feedCtrl = new FeedController()
  feedSpy = chai.spy(Pic.paginate)
  Pic.paginate = feedSpy
})

describe('[FeedController]', () => {
  it('fetch feed ', async (done) => {
    feedCtrl.fetchFeed(req, res).then(() => {
      expect(feedSpy).to.be.called()
      expect(Pic.paginate).to.be.spy
    }).catch()
    done()
  })
})
