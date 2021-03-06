'use strict'
/** @module models/User */

const Follow = require('./Follow')
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
  profilePic: {
    type: String,
    required: false
  },
  following: {
    type: [Object],
    required: false
  },

  followers: {
    type: [Object],
    required: false
  },
  wasFollowedByUser: {
    type: Boolean,
    required: false,
    unique: false,
    default: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
UserSchema.statics.fillable = ['name', 'lastname', 'nickname', 'email', 'password', 'profilePic' ]

/** fillable fields array. */
UserSchema.statics.hidden = ['password', 'token' ]
/** attach of the paginate plugin to the Schema. */
UserSchema.plugin(mongoosePaginate)

/*
 * search for users
 * @async
 * @return {Promise}
 * */
UserSchema.statics.search = async function (query) {
  let regexp = new RegExp(`^${query}$`, 'i')
  return this.model('User').find({
    $and: [
      { $or: [ { email: regexp }, { nickname: regexp }, { name: regexp }, { lastname: regexp } ] }
    ]
  }
  )
}
/*
 * compute the followers (follwers is where user us followed)
 * @async
 * @return {void}
 * */
UserSchema.methods.computeFollowers = async function () {
  this.followers = await Follow.find({ followed: this._id })
}
/*
 * compute the followings of current user (folliwing is where user us follwer)
 * @async
 * @return {void}
 * */
UserSchema.methods.computeFollowing = async function () {
  this.following = await Follow.find({ follower: this._id })
}

/*
 * middleware to compute the user data of this pic
 * @param {function} next
 * */
UserSchema.methods.userFollowed = async function (userId) {
  const res = await Follow.countDocuments({ follower: userId, followed: this._id })
  console.log(res, this.id)
  console.log('user follow')
  this.wasFollowedByUser = (res > 0)
}

/** export. */
module.exports = mongoose.model('User', UserSchema)
