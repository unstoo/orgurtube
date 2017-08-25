import React from 'react'
import styles from './style.css'


export default class GroupsPane extends React.Component {
  constructor(props){
    super(props)
    
    const channels = props.channels.items
    
    const groups = {}
    let groupTag = ''

    for (let id in channels) {
      groupTag = channels[id].groupTag      

      if (!groupTag) { continue }

      if (!groups[groupTag]) {
        groups[groupTag] = []
      }

      groups[groupTag].push(id)        
    }

    this.state = {
      channelsByGroups: groups,
      selectedFeedsGroup: props.feeds.selectedFeedsGroup
    }
    this.loadLatestVideosByGroup = this.loadLatestVideosByGroup.bind(this)
  }

  loadLatestVideosByGroup(e) {
    const groupName = e.target.innerHTML
    this.props.getVideosByGroupName(groupName, this.state.channelsByGroups[groupName])
  }

  render() {    
    return (
      <div className={styles.GroupsPane} onClick={this.loadLatestVideosByGroup}>
        { buildListOfGroupItems(this.props.groups, this.props.feeds.selectedFeedsGroup) }
      </div>
    )
  }
}


function GroupPaneItem ({style, children}) {
  return <li className={styles.GroupPaneItem} style={style}>
    {children}
  </li>
}

function setStyleIfSelected(bool) {
  return bool ? {borderLeft: 'solid 6px red'} : {}
}

function buildListOfGroupItems(groups, selectedFeedsGroup) {
  let selected
  
  return groups.map(aGroup => {
    selected = (aGroup === selectedFeedsGroup)
    return  <GroupPaneItem key={aGroup} style={setStyleIfSelected(selected)}>
      {aGroup}
    </GroupPaneItem>
  })  
}
