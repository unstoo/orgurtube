export const SELECT_CHANNEL = 'SELECT_CHANNEL'

export const selectChannel = channelId => ({
  type: SELECT_CHANNEL,
  channelId
})



export const ADD_GROUP = 'ADD_GROUP'

export const addGroup = groupName => ({
  type: ADD_GROUP,
  groupName
})



export const REMOVE_GROUP = 'REMOVE_GROUP'

export const removeGroup = groupName => ({
  type: REMOVE_GROUP,
  groupName
})



export const TOGGLE_GROUP_FOLD = 'TOGGLE_GROUP_FOLD'

export const toggleGroupFold = groupName => ({
  type: TOGGLE_GROUP_FOLD,
  groupName
})

export const INSERT_CHANNEL_INTO_GROUP = 'INSERT_CHANNEL_INTO_GROUP'

export const insertChannelIntoGroup = groupName => ({
  type: INSERT_CHANNEL_INTO_GROUP,
  groupName
})



export const REMOVE_CHANNEL_FROM_GROUP = 'REMOVE_CHANNEL_FROM_GROUP'

export const removeChannelFromGroup = channelId => ({
  type: REMOVE_CHANNEL_FROM_GROUP,
  channelId
})


export const FETCHED_VIDEOS_BY_GROUP_NAME = 'FETCHED_VIDEOS_BY_GROUP_NAME'

export const fetchedVideoFeedsByGroupName = (groupName, videos) => ({
  type: FETCHED_VIDEOS_BY_GROUP_NAME,
  groupName,
  videos
})