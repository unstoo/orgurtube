const http = require('https')

/**
 * @summary Prase YouTube XML video feeds into JSON format.
 * @param {string} xmlString 
 * @returns {{entries: <Array>, channelName: string}} Parsed video data.
 */
function parseYouTubeXmlVideoFeeds(xmlString) {
  let entries = xmlString.split(/<entry>/)
  const channelName = entries.shift().match(/<title>(.*)<\/title>/)[1]
  
  entries = entries.map(entry => {
    return {
      published: entry.match(/<published>(.*)<\/published>/)[1],
      title: entry.match(/<media:title>(.*)<\/media:title>/)[1],
      videoId: entry.match(/<yt:videoId>(.*)<\/yt:videoId>/)[1],
      viewes: entry.match(/<media:statistics views="(.*)"/)[1],
    }
  })
  
  return { entries, channelName }
}


/**
 * @param {string} channelId YouTube channel id.
 * @returns {Object} Parsed video feeds.
 */
async function fetchYouTubeChannel(channelId) {
  
  return new Promise((resolve, reject) => {    
    http.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, res => {
    
      const { statusCode } = res
      const contentType = res.headers['content-type']
  
      let error
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
  
      } else if (!/^text\/xml/.test(contentType)) {
        error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`)
      }
  
      if (error) {
        reject(error.message)
        // consume response data to free up memory
        return res.resume()        
      }
  
      res.setEncoding('utf8')
      let rawData = ''        
      res.on('data', chunk => { rawData += chunk })    
      res.on('end', () => { resolve(parseYouTubeXmlVideoFeeds(rawData)) })   
  
    }).on('error', (e) => {
      reject(`Got error: ${e.message}`)
    })   
  })  
}


async function fetchThem(ids, callback) {
  let xmlChannelsFeeds = ids.map(id => fetchYouTubeChannel(id))
  
  Promise.all(xmlChannelsFeeds).then(values => {
    callback(values)
  })
}


module.exports = fetchThem
