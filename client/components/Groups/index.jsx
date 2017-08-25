import { connect } from 'react-redux'
import Component from './component'
import { 
  insertChannelIntoGroup,
  removeChannelFromGroup,
  addGroup,
  removeGroup,
  toggleGroupFold } from '../../actions'
import actionApi from '../../actions/api'

const mapStateToProps = (state, ownProps) => {
  return {
    channels: state.channels,
    groups: state.groups
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

    onClick: (groupName) => {
      dispatch(
        actionApi({
          url: `/channels/tag`,
          method: `POST`,
          data: (state) => { return {groupName: groupName, channelId: state.channels.selectedChannel} },
          success: insertChannelIntoGroup.bind(null, groupName)     
        })
      )
    },

    actionAddGroup: (groupName) => {
      // const groupNamtStub = 'Group' + (new Date()).getTime()
      dispatch(
        actionApi({
          url: `/groups/`,
          method: `POST`,
          data: (state) => { return {groupName} },
          success: addGroup.bind(null, groupName)     
        })
      )
    },

    actionRemoveChannel: (e) => {
      let channelId = e.target.dataset.channelid

      dispatch(
        actionApi({
          url: `/channels/untag`,
          method: `POST`,
          data: (state) => { return { channelId } },
          success: removeChannelFromGroup.bind(null, channelId)    
        })
      )
    },

    actionRemoveGroup: (groupName) => {
      // let groupName 
      // dispatch(removeGroup(groupName))
      dispatch(
        actionApi({
          url: `/groups/`,
          method: `DELETE`,
          data: (state) => { return { groupName } },
          success: removeGroup.bind(null, groupName)    
        })
      )
    }
    
  }
}

const Groups = connect(mapStateToProps, mapDispatchToProps)(Component)

export default Groups
