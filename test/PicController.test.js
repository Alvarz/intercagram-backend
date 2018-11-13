'use strict'

const chai = require('chai')
const spies = require('chai-spies')
let PicController = require('../controllers/PicController')
const Pic = require('../models/Pic')
const authService = require('../services/authService')
const expect = require('chai').expect
const User = require('../models/User')
chai.use(spies)

/** some vars */
let searchSpy, picCtrl, createSpy, deleteSpy, paginateSpy

/** res mock */
let res = {
  json: (data) => {
    return data
  }
}

/** req mock */
let req = {
  data: '5be70c558ea4a431244080c2',
  body: { picer: '5be70c558ea4a431244080c2' },
  params: { id: '5be70c558ea4a431244080c2', query: 'search' },
  query: {
    page: 1
  }
}

/** mock method */
PicController.getAllSearchResultUsersPics = (array) => {
  return new Promise((resolve, reject) => {
    resolve(array)
  })
}

/** mock token reciever */
authService.getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    resolve(req)
  })
}

/** mock delete many */
Pic.findOneAndDelete = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}
/** mock pic */
Pic.create = (object) => {
  return new Promise((resolve, reject) => {
    resolve(object)
  })
}

/** mock pic paginate */
Pic.paginate = (object, object2) => {
  return new Promise((resolve, reject) => {
    resolve({ docs: [{ userLiked: (param) => {} }, { userLiked: (param) => {} }] })
  })
}

/** mock user search */
User.search = (query) => {
  return new Promise((resolve, reject) => {
    resolve([])
  })
}

beforeEach(() => {
  /** Clear the cache, this can be done in a way described in the example repo. Does not have to happen here */
  delete require.cache[require.resolve('../controllers/PicController')]

  /** Update our reference, this needs to happen here */
  PicController = require('../controllers/PicController')

  picCtrl = new PicController()

  createSpy = chai.spy(Pic.create)
  Pic.create = createSpy

  deleteSpy = chai.spy(Pic.findOneAndDelete)
  Pic.findOneAndDelete = deleteSpy

  searchSpy = chai.spy(User.search)
  User.search = searchSpy

  paginateSpy = chai.spy(Pic.paginate)
  Pic.paginate = paginateSpy
})

describe('[PicController]', () => {
  it('search ', async (done) => {
    picCtrl.search(req, res).then(() => {
      expect(searchSpy).to.be.called()
      expect(User.search).to.be.spy
    }).catch(err => {
      console.log(err)
    })
    done()
  })

  it('fetch by user ', async (done) => {
    picCtrl.fetchDataByUser(req, res).then(() => {
      expect(paginateSpy).to.be.called()
      expect(Pic.paginate).to.be.spy
    }).catch(err => {
      console.log(err)
    })
    done()
  })

  it('fetch by data ', async (done) => {
    picCtrl.fetchData(req, res).then(() => {
      expect(paginateSpy).to.be.called()
      expect(Pic.paginate).to.be.spy
    }).catch(err => {
      console.log(err)
    })
    done()
  })

  it('get data ', async (done) => {
    picCtrl.getData(req, res).then(() => {
      expect(paginateSpy).to.be.called()
      expect(Pic.paginate).to.be.spy
    }).catch(err => {
      console.log(err)
    })
    done()
  })

  it('put data ', async (done) => {
    picCtrl.putData(req, res)
    done()
  })

  it('delete data ', async (done) => {
    picCtrl.deleteData(req, res)
    done()
  })
})
