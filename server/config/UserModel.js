const mongoose = require('mongoose').set('debug', true)
const uniqueArrayPlugin = require('mongoose-unique-array')
const Schema = mongoose.Schema

// Some shaite deprication warning without it
// under "mongoose": "^4.10.8".
// Found on Github.
mongoose.Promise = global.Promise

const googlsSchema = new Schema({
  youTubeId: {
    type: String,
    required: true,
    unique: true
  },
  access_token: {
    type: String,
    required: true
  },
  token_type: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String
  },
  channels: Schema.Types.Mixed,

  groups: [   { type: String, unique: true } ]
})


googlsSchema.plugin(uniqueArrayPlugin)

const Model = mongoose.model(`googls`,  googlsSchema)

module.exports = Model
