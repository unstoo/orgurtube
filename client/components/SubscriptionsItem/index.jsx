import React from 'react'
import style from './style.css'

export default class SubscriptionsItem extends React.Component {
  

  render() {
    const {title, thumbnail, channelId} = this.props
    let selected = {}
    if(this.props.selected) {
      selected = {
        borderLeft: 'red 8px solid'
      }
    }
    return (
      <li className={style["Subscriptions--item"]} data-channelid={channelId} style={selected}>   
          <img src={thumbnail} alt={title}/>
        <span>{title}</span> 
      </li>)    
  }
}
