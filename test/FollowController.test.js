'use strict'

const chai = require('chai')
const spies = require('chai-spies')
let FollowController = require('../controllers/FollowController')
const Follow = require('../models/Follow')
const authService = require('../services/authService')
const expect = require('chai').expect
chai.use(spies)

/** some vars */
let followCtrl, followSpy, createSpy, deleteSpy

/** res mock */
let res = {
  json: (data) => {
    return data
  }
}

/** req mock */
let req = {
  data: '5be70c558ea4a431244080c2',
  body: { follower: '5be70c558ea4a431244080c2' },
  params: { id: '5be70c558ea4a431244080c2' },
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

/** mock delete many */
Follow.deleteMany = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}
/** mock follow */
Follow.create = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}
/** mock paginate */
Follow.paginate = (object, object2) => {
  return new Promise((resolve, reject) => {
    resolve({ docs: [
      { url: 'pic.jpg', likes: 1, userFollowFollowers: () => {}, userFollowFollwing: () => {} },
      { url: 'pic.jpg', likes: 1, userFollowFollowers: () => {}, userFollowFollwing: () => {} }
    ] })
  })
}

beforeEach(() => {
  /** Clear the cache, this can be done in a way described in the example repo. Does not have to happen here */
  delete require.cache[require.resolve('../controllers/FollowController')]

  /** Update our reference, this needs to happen here */
  FollowController = require('../controllers/FollowController')

  followCtrl = new FollowController()

  createSpy = chai.spy(Follow.create)
  Follow.create = createSpy

  followSpy = chai.spy(Follow.paginate)
  Follow.paginate = followSpy

  deleteSpy = chai.spy(Follow.deleteMany)
  Follow.deleteMany = deleteSpy
})

describe('[FollowController]', () => {
  it('fetch following ', async (done) => {
    followCtrl.fetchFollowing(req, res).then(() => {
      expect(followSpy).to.be.called()
      expect(Follow.paginate).to.be.spy
    }).catch()
    done()
  })

  it('fetch followers ', async (done) => {
    followCtrl.fetchFollowers(req, res).then(() => {
      expect(followSpy).to.be.called()
      expect(Follow.paginate).to.be.spy
    }).catch()
    done()
  })

  it('follow user ', async (done) => {
    followCtrl.followUser(req, res).then(() => {
      expect(createSpy).to.be.called()
      expect(Follow.create).to.be.spy
    }).catch()
    done()
  })

  it('unfollow user ', async (done) => {
    followCtrl.unfollowUser(req, res).then(() => {
      expect(deleteSpy).to.be.called()
      expect(Follow.deleteMany).to.be.spy
    }).catch()
    done()
  })
})
