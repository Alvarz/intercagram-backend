'use strict'
/** @module models/User */

const Follow = require('./Follow')
const User = require('./User')
/** Mongose lib. */
const mongoose = require('mongoose')

/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** User Shema. */
const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: false
  },
  lastname: {
    type: String,
    required: false,
    unique: false
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: false
  },
  token: {
    type: String,
    required: false,
    unique: true
  },
  following: {
    type: [Object],
    required: false
  },

  followers: {
    type: [Object],
    required: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
UserSchema.statics.fillable = ['name', 'lastname', 'nickname', 'email', 'password' ]

/** fillable fields array. */
UserSchema.statics.hidden = ['password', 'token' ]
/** attach of the paginate plugin to the Schema. */
UserSchema.plugin(mongoosePaginate)

/*
 * compute the real of users to follower following
 * @async
 * @return {void}
 * */
UserSchema.methods.computeRealUser = async (entry) => {
  const entries = await Follow.find({ follower: entry._id })

  console.log(entries, 'users')
  let usersToReturn = []
  entries.forEach(async (doc) => {
    const u = await User.findById(doc._id)
    console.log(u, 'user')
    usersToReturn.push(u)
  })

  return usersToReturn
}

/*
 * compute the likes of current pic
 * @async
 * @return {void}
 * */
/* UserSchema.methods.computeFollowing = async function (doc, next) {
  if (Array.isArray(doc)) {
    for (let key in doc) {
      doc[key].following = await Follow.find({ followed: doc[key]._id })
    }
  } else {
    doc.following = await Follow.find({ followed: doc._id })
  }

  const followed = await Follow.find({ followed: doc._id })

  console.log(followed, 'followed')

  next()
} */
/*
 * compute the likes of current pic
 * @async
 * @return {void}
 * */
UserSchema.methods.computeFollowers = async function (doc, next) {
  if (Array.isArray(doc)) {
    for (let key in doc) {
      doc[key].followers = UserSchema.methods.computeRealUser(doc[key])
    }
  } else {
    doc.followers = UserSchema.methods.computeRealUser(doc)
    // doc.followers = await Follow.find({ follower: doc._id })
  }

  next()
}

/*
 * adding middlewares on pre events
 * */
/* UserSchema
  .pre('find', UserSchema.methods.autoPopulate)
  .pre('findOne', UserSchema.methods.autoPopulate)
*/
/*
 * adding middlewares on post events
 * */
UserSchema
  .post('find', UserSchema.methods.computeFollowers)
  .post('findOne', UserSchema.methods.computeFollowers)
// .post('find', UserSchema.methods.computeFollowing)
  // .post('findOne', UserSchema.methods.computeFollowing)

/** export. */
module.exports = mongoose.model('User', UserSchema)
