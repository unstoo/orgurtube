import React from 'react'
import styles from './style.css'

export default class Group extends React.Component {
  constructor(props){
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
    this.state = {
      groupFolded : true
    }
  }
  
  clickHandler(e) {
    if (typeof e === 'string') {
    
      if (e.toLowerCase().includes('fold')) {
        console.log('fold')
        // TODO: set unfolded group through redux action?
        this.setState({groupFolded: !this.state.groupFolded})        
      } 

      if (e.toLowerCase().includes('remove')) {
        console.log(`remove`)
        this.props.actionRemoveGroup(this.props.name)
      } 

      return
    }        
        
    return this.props.actionInsertChannel(this)        
  }

  render() {    
    let {name} = this.props
    let isGroupFolded = this.state.groupFolded
    let style = isGroupFolded ? {display: `none`} : {display: ``}


    return (
      <li className={styles.Group} onClick={this.clickHandler}>
        <header>
          <h3>{name}</h3>
          <ModalMenu handleActionsFromModalMenu={this.clickHandler}>
            {[
              isGroupFolded ? `Unfold Group` : `Fold Group`,
              `Remove Group`,
            ]}
          </ModalMenu>
        </header>  
        <div style={style}>             
          <ul>
            {this.props.children}
          </ul>
        </div>
      </li>
    )
  }
}




class ModalMenu extends React.Component {
  constructor(props){
    super(props)    
    this.clickHandler = this.clickHandler.bind(this)
    this.state = {
      isModalUnfolded: false
    }
  }

  clickHandler(e) {
    e.stopPropagation()
    if (e.target.className === 'Group--menu') {
      this.setState({ isModalUnfolded: !this.state.isModalUnfolded })
    }
  }

  render() {
    const style = {
      display: this.state.isModalUnfolded ? 'flex' : 'none',
      flexWrap: `wrap`,
      justifyContent: 'center',
      position: 'absolute',
      backgroundColor: 'rgba(200,200,222,.95)',
      border: 'solid 1px silver',
      left: -1,
      right: -1,
      top: 20,
      bottom: -1,
      padding: 4
    }


    return <div onClick={this.clickHandler}>
      <button className="Group--menu" >
        &#709;      
      </button>
      <ul style={style}>
        {this.props.children.map(buttonName => (
          <li key={`button` + buttonName} style={{width: '100%'}}>
            <button 
              onClick={this.props.handleActionsFromModalMenu.bind(null, buttonName)}
            >
              {buttonName}
            </button>
          </li>
        ))}
      </ul>
      </div>
  }
}