'use strict'
/** @module models/Pic */

/** Mongose lib. */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')
const Like = require('./Like')
const comment = require('./Comment')

/** Pic Shema. */
const PicSchema = new mongoose.Schema({

  url: {
    type: String,
    required: true,
    unique: false
  },
  likes: {
    type: Number,
    required: false,
    unique: false,
    default: 0
  },
  commentsQty: {
    type: Number,
    required: false,
    unique: false,
    default: 0
  },
  comments: {
    type: [Object],
    required: false,
    unique: false
  },
  description: {
    type: String,
    required: false,
    unique: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  },
  wasLikedByUser: {
    type: Boolean,
    required: false,
    unique: false,
    default: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
PicSchema.statics.fillable = ['url', 'likes', 'comments', 'description', 'user' ]

/*
 * compute the comments of current pic
 * @async
 * @return {void}
 * */
PicSchema.methods.computeComments = async function (doc, next) {
  if (Array.isArray(doc)) {
    for (let key in doc) {
      let comments = await comment.find({ pic: doc[key]._id })
      doc[key].commentsQty = comments.length
      doc[key].comments = comments
    }
  } else {
    let comments = await comment.find({ pic: doc._id })
    doc.commentsQty = comments.length
    doc.comments = comments
  }
  next()
}
/*
 * compute the likes of current pic
 * @async
 * @return {void}
 * */
PicSchema.methods.computeLikes = async function (doc, next) {
  if (Array.isArray(doc)) {
    for (let key in doc) {
      doc[key].likes = await Like.countDocuments({ pic: doc[key]._id })
    }
  } else {
    doc.likes = await Like.countDocuments({ pic: doc._id })
  }

  next()
}

/*
 * middleware to compute the user data of this pic
 * @param {function} next
 * */
PicSchema.methods.userLiked = async function (userId) {
  const res = await Like.countDocuments({ user: userId, pic: this._id })
  console.log(res, this.id)
  this.wasLikedByUser = (res > 0)
}

/*
 * middleware to compute the user data of this pic
 * @param {function} next
 * */
PicSchema.methods.autoPopulate = function (next) {
  this.populate({ path: 'user', select: ['name', 'lastname', 'nickname', 'email'] })
  next()
}

/*
 * adding middlewares on pre events
 * */
PicSchema
  .pre('find', PicSchema.methods.autoPopulate)
  .pre('findOne', PicSchema.methods.autoPopulate)
/*
 * adding middlewares on post events
 * */
PicSchema
  .post('find', PicSchema.methods.computeLikes)
  .post('findOne', PicSchema.methods.computeLikes)
  .post('find', PicSchema.methods.computeComments)
  .post('findOne', PicSchema.methods.computeComments)

/** fillable fields array. */
PicSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
PicSchema.plugin(mongoosePaginate)

/** export. */
module.exports = mongoose.model('Pic', PicSchema)
