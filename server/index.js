// require('ignore-styles').default(['.css', '.sass', '.scss'])

require('babel-register')({
  "plugins": [
    "transform-es2015-modules-commonjs",
    // This is to mimic webpack's css-loader modules class name generation.    
    // In order to keep SSR React hooks intact.
    // ...webpack.config.js...
    // localIdentName: '[name]__[local]--[hash:base64:5]'
    // ...
    ["css-modules-transform",
         {"generateScopedName": "[name]__[local]--[hash:base64:5]"}
    ]
  ],
  "presets": ["react"]
})

const path = require('path')
const axios = require(`axios`)
const bodyParser = require('body-parser')
const cookieSession = require(`cookie-session`)

const mongoose = require('./config/db')
const Users = require(`./config/UserModel`)
const googleAuth = require(`./config/googleAuth`)
const morganCustom = require(`./config/morganCustom`)()

const express = require('express')
const server = express()
const ServerApp = require('../client/ServerApp')
const PORT = 3000
const api = require('./api')


if (process.env.NODE_ENV === 'development') {
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack') 
  const config = require('../webpack.config')
  const compiler = webpack(config)

  server.use(
    // Dynamic serve point for bundle.js.
    webpackDevMiddleware(compiler, {
      publicPath: config.devServer.publicPath
    })
  )
  
  server.use(webpackHotMiddleware(compiler))

} else {
  // Static serve point set to '../app/' folder.
  server.use(`/app`, express.static(path.join(__dirname.split('\\').slice(0,-1).join('\\'),'app')))
}

server.use(bodyParser.urlencoded({ limit: '52428800', extended: true }))
server.use(bodyParser.json({limit: '52428800'}))
server.use(morganCustom)

server.use(cookieSession({
  name: 'session',  
  keys: ['youTubeId'],
  maxAge: 24 * 60 * 60 * 1000
})) 



const {client_id, client_secret} = require(`../googleApi.json`)
server.use(`/auth`, googleAuth({
  client_id,
  client_secret,
  redirect_uri: `http://localhost:3000/auth/success`,
  auth_url_complete: `/`,
  ssr_handler: ServerApp
  })
)

server.use((req,res,next) => {
  if(req.originalUrl.includes(`/auth/`)) {
    return next()
  }

  // Unauthinticated user.
  if (!req.session.youTubeId) { 
    res.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Please login first</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>      
      <body>
        <div id="root">
        <a href="/auth/google">Login to your Google</a>
        </div>
      </body>
    </html>`)
    return res.end()
  }
  
  // Authinticated user.
  Users.findOne({youTubeId: req.session.youTubeId})
    .catch(err => next(err))
    .then(user => {
      req.body.user = user
      return next()
    })
})


// Known react-router routes. See ../components/App.jsx
server.get([`/`, `/feeds`, `/login`], (req,res) => {  

  const clientAsAString = ServerApp(req.body.user, req, res)
  res.write(clientAsAString)
  res.end()
})


server.use(`/api`, api)

server.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`)
})

