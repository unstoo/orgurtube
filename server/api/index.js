const api = require(`express`).Router()
const querystring = require(`querystring`)
const axios = require('axios')
const Users = require(`../config/UserModel`)
const fetchThem = require(`./youTubeRssFeeds`)
// const axios = require(`axios`)
// const fs = require(`fs`)


api.route(`/channels/tag/`)
  .post(async(req,res) => {
    req.body.user.channels[req.body.channelId].groupTag = req.body.groupName
    req.body.user.markModified('channels')

    req.body.user.save((err, updatedUser) => {
      if (err) {
        return res.send({ok: false})
      }
      req.body.user = updatedUser
      res.send({ok: true})
    })
  })

api.route(`/channels/untag/`)
  .post(async(req,res) =>{
    req.body.user.channels[req.body.channelId].groupTag = ''
    req.body.user.markModified('channels')

    req.body.user.save((err, updatedUser) => {
      if (err) {
        return res.send({ok: false})
      }
      req.body.user = updatedUser
      res.send({ok: true})
    })
  })

api.route(`/groups/`)

  .post(async(req,res) =>{
    req.body.user.groups.push(req.body.groupName)    
    req.body.user.markModified('groups')

    req.body.user.save((err, updatedUser) => {
      if (err) {
        return res.send({ok: false})
      }
      req.body.user = updatedUser
      res.send({ok: true})
    })
  })

  .delete(async(req, res) => {
    const filterGroupOut = req.body.groupName.toLowerCase()
    const filteredGroups = req.body.user.groups.filter(groupName => groupName.toLowerCase() !== filterGroupOut)
    req.body.user.groups =  filteredGroups 
    req.body.user.markModified('groups')

    for(let chanId in req.body.user.channels) {
      if(req.body.user.channels[chanId].groupTag && req.body.user.channels[chanId].groupTag.toLowerCase() === filterGroupOut) {
        req.body.user.channels[chanId].groupTag = ''
      }
    }

    req.body.user.markModified('channels')


    req.body.user.save((err, updatedUser) => {
      if (err) {
        return res.send({ok: false})
      }
      req.body.user = updatedUser
      res.send({ok: true})
    })
  })

api.route(`/videos/`)
  .post((req, res) => {    
    fetchThem(req.body.ids, data => {      
      res.send({
        ok: true,
        data: JSON.stringify(data)
      })
    })
  })


module.exports = api

  // POST api/channels/tag/ {body: groupName, channelId}
  // POST api/channels/untag/ {body: groupName, channelId}
  // POST api/groups/ {body: groupName}
  // DELETE api/groups/ {body: groupName}
  // POST api/videos/ {body: [channel ids]}