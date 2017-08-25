// !TODO: Move to config
const BASE_URL = 'http://localhost:3000/api'
import axios from 'axios'
axios.defaults.withCredentials = true
// In our case we will use the Flux Standard Action (FSA) convention and put the ID of the
// next action inside the success key (i.e., action.payload.success )



 /**
 * @summary Unified async actions middleware. // It one ugly description is, Yoda says. TODO: Learn to summarize like a jedi, not like Bighead.
 * 
 * @param {{type: string, payload: { data: function }}} action // How do I even desrcibe this filth nesting in a concise way?
 * @returns {void} Dispatches preset Redux action.
 */
const apiMiddleware = ({ getState, dispatch }) => next => action => {
  if (action.type !== `API`) {
    return next(action)
  }

  const {payload} = action
  const state = getState()
  const url = BASE_URL + payload.url + `?hash=` + (new Date()).getTime()
  console.log(url)
  
  // @param action.payload.data {function} Yields data that will be passed in a body of a request.
  axios(url, {
    method: payload.method,
    data: payload.data(state),
    withCredentials: true
  })
  .then(response => {
    console.log(`API Response to request: `, response.request.responseURL) 
    dispatch( payload.success(response.data.data) )
  })
  .catch(err => {
    console.warn(`API_ERROR`, err)
    dispatch( {type:`API_ERROR`, payload: err } )
  })

}

export default apiMiddleware
