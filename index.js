'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const Router = require('./router/router')
const app = express()
const path = require('path')
require('./database/database')

let router = new Router(express, app)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use('/', router.routes())
// console.log(`${__dirname}/storage`)
app.use('/photos', express.static(path.join(`${__dirname}/storage`)))

let server = app.listen('3000', '127.0.0.1', () => {
  let host = server.address().address
  let port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
