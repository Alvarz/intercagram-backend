'use strict'
/** @module models/Comment */

/** Mongose lib. */
const mongoose = require('mongoose')

const Schema = mongoose.Schema
/** Mongose pagination lib. */
const mongoosePaginate = require('mongoose-paginate')

/** Comment Shema. */
const CommentSchema = new mongoose.Schema({

  pic: {
    type: Schema.Types.ObjectId,
    ref: 'Pic',
    required: true,
    unique: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
CommentSchema.statics.fillable = ['pic', 'user', 'description' ]

/** fillable fields array. */
CommentSchema.statics.hidden = []
/** attach of the paginate plugin to the Schema. */
CommentSchema.plugin(mongoosePaginate)
/** export. */
module.exports = mongoose.model('Comment', CommentSchema)
