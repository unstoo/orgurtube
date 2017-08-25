import React from 'react'
import styles from './style.css'

export default class GroupItem extends React.Component {
  render() {
  const {title, thumbnail, channelId} = this.props
    return (
      <li className={styles.Groupitem}>
        <img src={thumbnail} alt={title}/>
        <span>{title}</span>
        <button 
          data-channelid={channelId}
          onClick={this.props.actionRemoveChannel}
        >
          X
        </button>
      </li>
    )
  }
}
