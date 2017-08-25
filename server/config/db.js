const Mongoose = require('mongoose').set('debug', true)

Mongoose.connect('mongodb://localhost/myapp')

const db = Mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function callback() {
    console.log("Connection with database succeeded.")
}) 

exports.db = db
