'use strict'
/** @module models/Pic */

/** Mongose lib. */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Pic Shema. */
const FollowSchema = new mongoose.Schema({

  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
FollowSchema.statics.fillable = ['followed', 'follower' ]

/*
 * middleware to compute the user data of this pic
 * @param {function} next
 * */
FollowSchema.methods.autoPopulate = function (next) {
  this.populate({ path: 'User', select: ['name', 'lastname', 'nickname', 'email'] })
  this.populate({ path: 'followed', select: ['name', 'lastname', 'nickname', 'email'] })
  next()
}

/*
 * adding middlewares on pre events
 * */
FollowSchema
  .pre('find', FollowSchema.methods.autoPopulate)
  .pre('findOne', FollowSchema.methods.autoPopulate)

/** fillable fields array. */
FollowSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
FollowSchema.plugin(mongoosePaginate)

/** export. */
module.exports = mongoose.model('Follow', FollowSchema)
