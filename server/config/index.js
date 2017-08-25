// Master Config
// Should leech all oAuth secrets & db password from node.env

exports.module = {
  db: {
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    url: process.env.DB_URL
  },
  googleApi: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET
  }
}