import React from 'react'
import style from './style.css'
import GroupItem from '../GroupItem'
import Group from '../Group'

export default class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.insertIntoGroupHandler = this.insertIntoGroupHandler.bind(this)
    this.handleNewGroupInputChange = this.handleNewGroupInputChange.bind(this)
    this.addNewGroup = this.addNewGroup.bind(this)
    this.state = {
      newGroupName: ``,
      disableNewGroupCreation: true
    }
  }

  handleNewGroupInputChange(e) {
    let disableNewGroupCreation = true
    const newGroupName = e.target.value
    // validate groupName
    newGroupName.length ? disableNewGroupCreation = false : disableNewGroupCreation = true

    this.setState({
      newGroupName,
      disableNewGroupCreation
    })
  }

  addNewGroup(e) {
    this.props.actionAddGroup(this.state.newGroupName)
  }

  insertIntoGroupHandler(aGroup) {    
    // No sbuscription to insert into the group. 
    this.props.onClick(aGroup.props.name)
  }

  render() {
    const channelsByGroups = {}
    const channelKeys = Object.keys(this.props.channels.items)
    
    channelKeys.forEach(key => {
      if (this.props.channels.items[key].groupTag) {
        let groupTag = this.props.channels.items[key].groupTag

        if (!channelsByGroups[groupTag]) {
          channelsByGroups[groupTag] = []        
        } 
        
        channelsByGroups[groupTag].push(
          Object.assign(
            {channelId: key},
            this.props.channels.items[key]
          )
        )        
      }
    })
    
    
    const groups = this.props.groups.map(aGroup => {
      return <Group 
        name={aGroup} 
        key={aGroup}
        actionInsertChannel={this.insertIntoGroupHandler}
        actionRemoveGroup={this.props.actionRemoveGroup}
      >

        {channelsByGroups[aGroup] && 
          channelsByGroups[aGroup].map( channel => {
            return <GroupItem
              actionRemoveChannel={this.props.actionRemoveChannel}
              key={aGroup+channel.channelId}
              channelId={channel.channelId}
              title={channel.title}
              thumbnail={channel.thumbnails.default}
              /> 
          })
        }
           
      </Group>
    })
    
    return (
      <section className={style.Groups}>
        <header>
          <h2>Groups</h2>
          <input type='text' onChange={this.handleNewGroupInputChange}/>
          <button onClick={this.addNewGroup} disabled={this.state.disableNewGroupCreation}>
            Add group
          </button> 
        </header>
        <ul>
          {groups}
        </ul>
      </section>
    )
  }
}