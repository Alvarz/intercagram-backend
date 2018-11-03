'use strict'
/** @module models/User */

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
  }
}, { timestamps: true }, { strict: true })

/** fillable fields array. */
UserSchema.statics.fillable = ['name', 'lastname', 'nickname', 'email', 'password' ]

/** fillable fields array. */
UserSchema.statics.hidden = ['password', 'token' ]
/** attach of the paginate plugin to the Schema. */
UserSchema.plugin(mongoosePaginate)

/** export. */
module.exports = mongoose.model('User', UserSchema)
