import { createStore, combineReducers } from 'redux'

import axios from 'axios'

import {
  ADD_GROUP, 
  INSERT_CHANNEL_INTO_GROUP,
  REMOVE_CHANNEL_FROM_GROUP,
  REMOVE_GROUP,
  FETCHED_VIDEOS_BY_GROUP_NAME
} from '../actions'

export const initialState = {
  unfoldedGroup: null,
  channels: {
    selectedChannel: null,
    items: {}
  },
  groups: [],
  feeds: {}
}

function unfoldedGroup(state=null, action){
  return state
}




function channels(state={}, action) {
  switch (action.type) {   
    case 'SELECT_CHANNEL':    
      return Object.assign({}, state, { selectedChannel: action.channelId }) 

    case INSERT_CHANNEL_INTO_GROUP:
      if (!state.selectedChannel) {
        return state
      }

      const channelId = state.selectedChannel
      let tagChannel = {}

      tagChannel[channelId] =  Object.assign(
        {}, 
        state.items[channelId], 
        {groupTag: action.groupName})
        
      let items = Object.assign({}, state.items, tagChannel)
        

      return Object.assign({}, state,
         {selectedChannel: null}, 
         { items })

    case REMOVE_CHANNEL_FROM_GROUP:
      let channel = {}
      let id = action.channelId

      channel[id] =  Object.assign(
        {}, 
        state.items[id], 
        {groupTag: ''})

      return  Object.assign({}, state, 
        { items: Object.assign({}, state.items, channel)}) 

    case REMOVE_GROUP:
        return untagChannels(action.groupName, state)

    default:
      return state
  }
}

function groups(state=[], action) {
  switch (action.type) {
  case ADD_GROUP:
      return state.concat(action.groupName)  


  case REMOVE_GROUP:
           
      return removeGroupFromArray(action.groupName, state)

      // Clear associated channel tags
      const untaggedChannels = untagChannels(action.groupName, state.channels)
      

      return Object.assign(
        {}, state,
        { channels: untaggedChannels },
        { groups: purgedGroups })


  default:
    return state
  }
}

function feeds(state={}, action) {
  switch (action.type) {
    case FETCHED_VIDEOS_BY_GROUP_NAME:
      return Object.assign({}, state, 
        {[action.groupName]: action.videos, selectedFeedsGroup: action.groupName}
      )

    default:
      return state
  }
}


const combinedReducer = combineReducers({
  unfoldedGroup,  
  channels,
  groups,
  feeds
})





const removeGroupFromArray = (groupName, arrayOfGroups) => {
  const indexToRemove = arrayOfGroups.indexOf(groupName)

  const result = arrayOfGroups.slice(0, indexToRemove)
      .concat(arrayOfGroups.slice(indexToRemove + 1))

  return result 
}

const untagChannels = (groupName, channels) => {
  const channelKeys = Object.keys(channels.items)
  const untaggedChannels = {}

  channelKeys.forEach(key => {
    if (channels.items[key].groupTag === groupName) {   

      untaggedChannels[key] = Object.assign(
        {},
        channels.items[key],
        { groupTag: ''})
    }

  }) 

  return Object.assign({}, {
    selectedChannel: channels.selectedChannel,
    items: Object.assign({}, channels.items, untaggedChannels)
  }) 
}



export default combinedReducer
