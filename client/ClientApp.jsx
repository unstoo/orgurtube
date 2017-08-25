import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose  } from 'redux'
import measureMiddleware from './middleware'
import fetchStuff from './middleware/api'
import App from './App'
import combinedReducer, { initialState } from './reducers'

// Injected by backend at SSR stage.
const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__


// !TODO: production ? remove REDUX DEV TOOLS
// https://github.com/zalmoxisus/redux-devtools-extension
// "It's useful to include the extension in production as well. ..."
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// If you produced reducer with combineReducers, 
// this must be a plain object 
// with the same shape as the keys passed to it.
const store = createStore(
  combinedReducer,
  preloadedState,
  composeEnhancers(
    applyMiddleware(measureMiddleware, fetchStuff)
  )
)


const renderApp = (store) => {
  render(  
    <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>  
    </BrowserRouter>,
    document.getElementById('root')
)}

renderApp(store)

// Available only in dev.
if (module.hot) {
  // If the module is hot Run renderApp(), которая вернет строку с HTML
  // по websocket'у, на клиенте слушает react-hot-loader/babel
  // заменит только затронутые куски.
  module.hot.accept('./App', () => {
    renderApp(store)
  })
}
