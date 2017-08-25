import { connect } from 'react-redux'
import Component from './component'

const mapStateToProps = (state, ownProps) => {
  
  return {
    channels: state.channels.items,
    selectedChannel: state.channels.selectedChannel
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (channelId) => {
      
      dispatch({type: `SELECT_CHANNEL`, channelId})
    }
  }
}

const Subscriptions = connect(mapStateToProps, mapDispatchToProps)(Component)

export default Subscriptions
