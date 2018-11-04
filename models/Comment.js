'use strict'
/** @module models/Comment */

/** Mongose lib. */
const mongoose = require('mongoose')

/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Comment Shema. */
const CommentSchema = new mongoose.Schema({

  pic_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    required: true,
    unique: false
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
CommentSchema.statics.fillable = ['pic_id', 'user_id', 'description' ]

/** fillable fields array. */
CommentSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
CommentSchema.plugin(mongoosePaginate)
/** export. */
module.exports = mongoose.model('Comment', CommentSchema)
