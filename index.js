'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Router = require('./router/router')
const app = express()
require('./database/database')

let router = new Router(express, app)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', router.routes())

let server = app.listen('3000', '127.0.0.1', () => {
  let host = server.address().address
  let port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
