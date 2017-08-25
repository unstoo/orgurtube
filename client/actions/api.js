const API = 'API'

// 'API' typed actions are proccessed by the middleware
// See '../middleware/api.js'
const actionApi = ({  
  url, 
  method,
  data, /* object */
  success /* Synchronous action createor function */}) => {

  return  {
    type: API,
    payload: {
      method,
      data,
      url,
      success
    }
  } 
}

export default actionApi
