import { connect } from 'react-redux'
import Component from './component'
import { 
  insertChannelIntoGroup,
  removeChannelFromGroup,
  addGroup,
  removeGroup,
  toggleGroupFold,
  fetchedVideoFeedsByGroupName } from '../../actions'
import actionApi from '../../actions/api'

const mapStateToProps = (state, ownProps) => {
  return {
    channels: state.channels,
    groups: state.groups,
    feeds: state.feeds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getVideosByGroupName: (groupName, ids) => {

      dispatch(
        actionApi({
          url: `/videos/`,
          method: `POST`,
          data: (state) => { return { ids } },
          success: fetchedVideoFeedsByGroupName.bind(null, groupName)     
        })
      )
    }    
  }
}

const Groups = connect(mapStateToProps, mapDispatchToProps)(Component)

export default Groups


