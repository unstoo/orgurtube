const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require ('extract-text-webpack-plugin')

const config = {
  context: __dirname,
  // https://github.com/glenjamin/webpack-hot-middleware
  // 'webpack-hot-middleware/client'
  // connects to the server to receive notifications
  // when the bundle rebuilds and then updates your client bundle accordingly.
  // path - The path which the middleware is serving the event stream on  
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './client/ClientApp.jsx'],

  devtool: process.env.NODE_ENV === 'development' ? 'cheap-eval-source-map' : false,

  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'bundle.js',
    // Сюда выплевывает bundle
    publicPath: '/app/'
  },

  devServer: {
    hot: true,
    // Сюда маунтит из памяти
    publicPath: '/app/',
    historyApiFallback: true,
    port: 3000
  },
  
  resolve: { extensions: ['.js', '.jsx', '.json'] },

  stats: { colors: true, reasons: true, chunks: false },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.jsx$/, exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { 
            presets: [
              /*'env', Ruin's reac-hot-loader, thus disabled in development ENV*/ 
              'react'],  plugins: ['react-hot-loader/babel']
            }
        } 
      }        
    ]
  }
}

console.log(`process.env.NODE_ENV=`, process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  // Remove Webpack hot middleware
  config.entry.shift()
  if (config.module.rules[0].use.loader === 'babel-loader') {
    config.module.rules[0].use.options.presets.push('env')
  }
  // config.plugins.push(new ExtractTextPlugin(`bundle.css`))
  // config.module.rules.push({
  //   test: /\.css$/,
  //   loader:  
  //   ExtractTextPlugin.extract({
  //     fallback: "style-loader",
  //     use: "css-loader"
  //   })    
  // })
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  config.module.rules.push({
    test: /\.css$/,
    use: [
      {loader: 'style-loader'},
    {
     loader: 'css-loader',
     options: {
       modules: true,
       localIdentName: '[name]__[local]--[hash:base64:5]'
     }
   }]
  })
}

module.exports = config
