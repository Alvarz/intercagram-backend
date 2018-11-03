let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/intercagram-backend', { useNewUrlParser: true, useCreateIndex: true }, function (err) {
  if (err) throw err
  console.log('Successfully connected')
})
