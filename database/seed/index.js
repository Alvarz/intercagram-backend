#!/usr/bin/env node

let mongoose = require('mongoose')

const userSeed = require('./userSeed')
const followSeed = require('./followSeed')
const picSeed = require('./picSeed')
const commentSeed = require('./commentSeed')
const likeSeed = require('./likeSeed')
/**
 * @desc used to seed the datbase
 * */
mongoose.connect('mongodb://localhost/intercagram-backend', { useNewUrlParser: true, useCreateIndex: true }, async function (err, conn) {
  if (err) throw err
  console.log('connected')

  /*
 * run the seeder process
 */
  console.log('start seeding')
  await userSeed()
  console.log('user seeded')
  await followSeed()
  console.log('follow seeded')
  await picSeed()
  console.log('pic seeded')
  await commentSeed()
  console.log('comment seeded')
  await likeSeed()
  console.log('done seeding')

  conn.close()
})
