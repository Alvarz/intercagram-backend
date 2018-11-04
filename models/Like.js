'use strict'
/** @module models/Like */

/** Mongose lib. */
const mongoose = require('mongoose')

/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Like Shema. */
const LikeSchema = new mongoose.Schema({

  pic_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    unique: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
LikeSchema.statics.fillable = ['pic_id', 'user_id' ]

/** fillable fields array. */
LikeSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
LikeSchema.plugin(mongoosePaginate)
/**
 * set unique the match of pics and users so each pic can be like by the user
 * only one time
 **/
LikeSchema.index({ user_id: 1, pic_id: 1 }, { unique: true })
/** export. */
module.exports = mongoose.model('Like', LikeSchema)
