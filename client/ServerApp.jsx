const React = require('react')
const renderToString = require(`react-dom/server`).renderToString 
const createStore =  require('redux').createStore
const Provider = require('react-redux').Provider
const StaticRouter = require('react-router-dom').StaticRouter

import App from './App'
import combinedReducer from './reducers'


/** @description SSR entry point
 * @typedef {function} preloadedState
 * @param {function} req express.request(). 
 * @param {function} res  express.response().
 * @returns {string} html string.
 */
module.exports = (preloadedState, req, res) => {  
  // Create a new Redux store instance.
  // Redux dox...
  // You may optionally specify the initial state 
  // as the second argument to createStore(). 
  // This is useful for hydrating the state 
  // of the client to match the state 
  // of a Redux application running on the server.
  
  // If you produced reducer with combineReducers, 
  // this must be a plain object 
  // with the same shape as the keys passed to it.
  const shapedState = {
    channels:
    {
      selectedChannel: null,
      items: preloadedState.channels
    },
    groups: preloadedState.groups
  }

  const store = createStore(combinedReducer, shapedState) 

  // Render app to a string.
  const context = {}
  const html = renderToString(
    <StaticRouter context={context} location={req.url}>
      <Provider store={store}>
        <App/>
      </Provider>
    </StaticRouter>
  )

  if (context.url) {
    res.redirect(301, context.url)
  }

  // Return to a backend.
  return injectAppIntoHtml(html, shapedState)  
}


function injectAppIntoHtml(app, state) {
  if (!state) state = {}
  // <link rel="stylesheet" href="app/bundle.css"></link>
  // <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  // <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Server rendered</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>      
      <body>
        <div id="root">${app}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}          
        </script>
        <script src="app/bundle.js"></script>
      </body>
    </html>
    `
}
