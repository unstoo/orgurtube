import React from 'react'
import styles from './style.css'

export default class Header extends React.Component{
  clickHandler(e) {
    console.log(e)
  }
  render() {
    return <div>
      <header className={styles.Header}>
      <h1>orgYourTube</h1>
        <nav onClick={this.clickHandler}>
          {this.props.children}
        </nav>  
      </header>
      <div className={styles.Header_heightfiller}></div>
    </div>
  }
}
