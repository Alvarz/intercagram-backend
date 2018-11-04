'use strict'
/** @module models/Like */

/** Mongose lib. */
const mongoose = require('mongoose')

const Schema = mongoose.Schema
/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Like Shema. */
const LikeSchema = new mongoose.Schema({

  pic: {
    type: Schema.Types.ObjectId,
    ref: 'Pic',
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
LikeSchema.statics.fillable = ['pic', 'user' ]

/** fillable fields array. */
LikeSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
LikeSchema.plugin(mongoosePaginate)
/**
 * set unique the match of pics and users so each pic can be like by the user
 * only one time
 **/
// LikeSchema.index({ user: 1, pic: 1 }, { unique: true })
/** export. */
module.exports = mongoose.model('Like', LikeSchema)
