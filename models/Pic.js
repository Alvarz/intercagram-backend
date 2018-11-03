'use strict'
/** @module models/Pic */

/** Mongose lib. */
const mongoose = require('mongoose')

/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Pic Shema. */
const PicSchema = new mongoose.Schema({

  url: {
    type: String,
    required: true,
    unique: true
  },
  likes: {
    type: Number,
    required: false,
    unique: false,
    default: 0
  },
  comments: {
    type: Number,
    required: false,
    unique: false
  },
  description: {
    type: String,
    required: false,
    unique: false
  },
  user_id: {
    type: String,
    required: true,
    unique: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
PicSchema.statics.fillable = ['url', 'likes', 'comments', 'description', 'user_id' ]

/** fillable fields array. */
PicSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
PicSchema.plugin(mongoosePaginate)

/** export. */
module.exports = mongoose.model('Pic', PicSchema)
