import React from 'react'
import style from './style.css'
import SubscriptionsItem from '../SubscriptionsItem'

export default class Subscriptions extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelectChannel = this.handleSelectChannel.bind(this)
  }

  handleSelectChannel(element) {
    const channelId = 
      element.target.parentElement.dataset.channelid || element.target.dataset.channelid

    this.props.onClick(channelId)
  }

  render() {
    const {channels, selectedChannel} = this.props
    const subscriptionsList = Object.keys(channels).map(key => {      
      if(channels[key].groupTag) {
        return
      }

      let props = {
        key,
        channelId: key,
        title: channels[key].title,
        thumbnail: channels[key].thumbnails.default,
        selected: key === selectedChannel
      }  

      return <SubscriptionsItem  {...props} />      
    })
    
    return (
      <section className={style.Subscriptions}>
        <header><h2>Subscriptions</h2></header>
        <ul onClick={this.handleSelectChannel}>
          {subscriptionsList}
        </ul>
      </section>)
  }
}