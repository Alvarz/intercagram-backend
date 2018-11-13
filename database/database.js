let mongoose = require('mongoose')

/** select the proper configuration */
const conn = (process.env.MONGODB_HOST) ? `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}` : 'mongodb://localhost/intercagram-backend'
/** get the mongoose connection intance */
mongoose.connect(conn, { useNewUrlParser: true, useCreateIndex: true }, function (err) {
  if (err) throw err
  console.log('Successfully connected')
})
