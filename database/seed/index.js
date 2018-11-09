#!/usr/bin/env node

let mongoose = require('mongoose')

const userSeed = require('./userSeed')
const followSeed = require('./followSeed')
const picSeed = require('./picSeed')
const commentSeed = require('./commentSeed')
const likeSeed = require('./likeSeed')

mongoose.connect('mongodb://localhost/intercagram-backend', { useNewUrlParser: true, useCreateIndex: true }, async function (err, conn) {
  if (err) throw err
  console.log('connected')

  console.log('start seeding')
  await userSeed()
  await followSeed()
  await picSeed()
  await commentSeed()
  await likeSeed()
  console.log('done seeding')

  conn.close()
})
