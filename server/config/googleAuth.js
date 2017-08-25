const googleAuthRouter = require(`express`).Router()
const querystring = require(`querystring`)
const axios = require(`axios`)
const fs = require(`fs`)
const Users = require(`./UserModel`)

async function getYouTubeId(token) {
  const url = `https://www.googleapis.com/youtube/v3/channels/?mine=true&part=contentDetails`
  const headers = { headers: {"Authorization": token } }

  const masterChannel = await axios.get(url, headers)
  
  if (+masterChannel.status !== 200) {
    throw new Error(`Couldn't retrieve youTube id. ${masterChannel.status} ${masterChannel.statusText}`)
  }
          
  return { 
    youTubeId: masterChannel.data.items[0].id, 
    channelUploads: masterChannel.data.items[0].contentDetails.relatedPlaylists.uploads 
  }
}

async function getYouTubeSubscriptions(token) {
  // https://developers.google.com/youtube/v3/docs/subscriptions
  // GET https://www.googleapis.com/youtube/v3/sunscriptions
  const baseUrl = `https://www.googleapis.com/youtube/v3/subscriptions`
  const params = `?mine=true&part=snippet%2Cid&maxResults=50&order=alphabetical`
  const headers = { headers: {"Authorization": token} }
  let items = [], result, nextPageToken

  do {
    nextPageToken ? nextPageToken = `&pageToken=${nextPageToken}` : nextPageToken = ``
    result = await axios.get(baseUrl + params + nextPageToken, headers)
    nextPageToken = result.data.nextPageToken || ``
    items = items.concat(result.data.items)

  } while (nextPageToken)

  return items
}

async function revokeGoogleToken(token) {
  // "Content-type:application/x-www-form-urlencoded"   
  //  https://accounts.google.com/o/oauth2/revoke?token={token}
  // 200 - ok, 400 - failed
  // dbClearToken(userId)
  const result = await axios.get(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
  return (result === 200 ? true : false)
}


// TODO;

module.exports = (options) => {
  googleAuthRouter.use((req, res, next) => {
    // // Hasn't authorized yet, or has lost his session.
    // if (!req.session.youTubeId) { return next() }
    // // Session has been created, but no User record in our db.
    // if (req.session.youTubeId && !req.body.user) { return next() }
    
    next()
    // res.redirect(`/`)
    // If session cookie maps to a user in DB.
    // 1 Wants to refresh token?
    // 2 Wants to change YouTube profile?
    // 3 ? Yevgen want's to hack some data from db
  })


  let { auth_url_start, auth_url_google, auth_url_google_token, auth_url_failed, auth_url_complete, 
    state, scope, redirect_uri, client_id, client_secret, ssr_handler } = options

  if (!redirect_uri || !client_id || !client_secret || !ssr_handler) {
    throw new Error(`options.redirect_uri, options.client_id, options.client_secret are obligatory.`)
  }

  auth_url_start =  auth_url_start || `/google`
  auth_url_google = auth_url_google || `https://accounts.google.com/o/oauth2/v2/auth`
  auth_url_google_token = auth_url_google_token || `https://www.googleapis.com/oauth2/v4/token`
  auth_url_failed = auth_url_failed || `failed`
  auth_url_complete = auth_url_complete || `complete`
  state = state || ``
  scope = scope || `https://www.googleapis.com/auth/youtube`
  

  const authQuery = `${auth_url_google}?` +
    querystring.stringify({
      client_id,
      redirect_uri,
      scope,
      state,
      access_type: `offline`,
      response_type: `code`
    }) 
    
  const getTokenQuery = querystring.stringify({
    client_id,
    client_secret,
    redirect_uri,
    access_type: `offline`,
    grant_type: `authorization_code`  
  })

  const refreshTokenQuery = querystring.stringify({
    client_id,
    client_secret,
    grant_type: `refresh_token`
  })

  async function refreshGoogleToken(refresh_token) {
    {
      // POST /oauth2/v4/token HTTP/1.1
      // Host: www.googleapis.com
      // Content-Type: application/x-www-form-urlencoded
      // Request.
      //  client_id=<your_client_id>&
      //  client_secret=<your_client_secret>&
      //  refresh_token=<refresh_token>&
      //  grant_type=refresh_token
      // Response.
      // {
      //   "access_token":"1/fFAGRNJru1FTz70BzhT3Zg",
      //   "expires_in":3920,
      //   "token_type":"Bearer"
      // }
    }
    return await axios.post(`https://www.googleapis.com/oauth2/v4/token`, 
      refreshTokenQuery + `&refresh_token=${refresh_token}`)
  }

  async function getGoogleAccessToken(authorizationCode) {
    {
      //   "access_token":"1/fFAGRNJru1FTz70BzhT3Zg",
      //   "expires_in":3920,
      //   "token_type":"Bearer",
      //   "refresh_token":"1/xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
    }  
    const googleToken = await axios.post(`${auth_url_google_token}`, 
      getTokenQuery + `&code=` + authorizationCode)

    return googleToken.data
  }

  // Redirect user to Google oAuth page.
  googleAuthRouter.route(auth_url_start)
    .get((req, res) => res.redirect(authQuery))

  // User returned from Google oAuth page.
  googleAuthRouter.route(`/${redirect_uri.split(`/`).pop()}`)
    .get(async (req, res) => {
      // Passed in by Google.
      const {state, code} = req.query

      if (!code) {
        // Show page that login has failed
        throw new Error(`Auth-Error: Google auth code's absent.`)
      } 
      
      try {
        // Exchange authorization code for an access token.
        const {token_type, access_token, refresh_token} = await getGoogleAccessToken(code)
        
        // Load user's youTube id.
        const {youTubeId, channelUploads} = await getYouTubeId(`${token_type} ${access_token}`)

        // Create a user session.
        req.session.youTubeId = youTubeId

        // TODO!: from file in dev, sync with Google API in production instead.
        //const subs = require(`../subs.json`).subs  
        const subs = await getYouTubeSubscriptions(`${token_type} ${access_token}`)        

        // 1 -- User exists
        const user = await Users.findOne({youTubeId}) 
        
        if (user) {
          return res.redirect('/')
        }

        // 2 -- User doesn't exist
        let newUser = {   
          youTubeId,       
          access_token,
          refresh_token,
          token_type,
          channels: {},
          groups: []
        }        

        let channelsObject = {} 

        subs.forEach(s => {  
          return channelsObject[s.snippet.resourceId.channelId] = {
            groupTag: s.groupTag,
            title: s.snippet.title,
            description: s.snippet.description,
            thumbnails: {
              default: s.snippet.thumbnails.default.url,
              medium: s.snippet.thumbnails.medium.url,
              high: s.snippet.thumbnails.high.url
            }
        }})

        newUser.channels = channelsObject  
        
        const created = await (new Users(newUser)).save()
        
        const userState = {}
        userState.channels = created.channels
        userState.groups = created.groups.map(group => group)

        res.redirect('/')    

      } catch (e) {
        const err = e.response || e.request || e.message || e || `Default_err_msg`
        console.log(err)
        return res.redirect(`${auth_url_failed}?msg=${err}`)
      }  
    })

    return googleAuthRouter
}
