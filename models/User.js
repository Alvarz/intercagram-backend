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

/** export. */
module.exports = mongoose.model('User', UserSchema)
