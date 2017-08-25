// The underlying rule is simple: 
// our root reducer requires an object as an action, 
// but our middleware have no such limits 
// and are free to handle any type of data passed to dispatch() 

const measureMiddleware = ({dispatch, getState}) => {
  return (next) => {
    return (action) => {
      console.time(action.type)
      next(action)
      console.timeEnd(action.type)
    }
  }
}

export default measureMiddleware


const pending = {}

const debounceMiddleware = () => next => action => {
  const {deboucne} = action.meta || {}

  if (!debounce /* ms */) {
    next(action)
  }

  if (pending[action.type]) {
    clearTimeout( pending[action.type] )
  }

  pending[action.type] = setTimeout(
    () => {
      delete pending[action.type]
      next(action)
    },
    debounce
  )
}


