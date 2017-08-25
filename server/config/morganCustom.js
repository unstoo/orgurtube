const morgan = require(`morgan`)
require(`colors`)

morgan.token('session',  (req, res) =>  `Session ` + JSON.stringify(req.session))
morgan.token('body',  (req, res)=>   `Body ` + JSON.stringify(Object.assign({}, req.body, {user: `--`})))
morgan.token('headers', (req, res) => `Headers ` + JSON.stringify(req.headers, null, 2))
morgan.token('res', (req, res) => `Response ` + JSON.stringify(res.headers, null, 2))
morgan.token('br', (req, res) => `\n` )

module.exports = () => {
  return morgan(
    `:br REQUEST> `.cyan + `:method ":url" HTTP/:http-version` 
    + ` :br  :headers`
    + ` :br  :session` 
    + ` :br  :body`
    + `:br RESPONSE> `.green + `:status :response-time `
    + `:br ------------------------------------------------- `
  )
}