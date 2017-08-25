import React from 'react'
import styles from './style.css'

export default class Main extends React.Component {
  render() {
    return (
      <main className={styles.Main}>
        {this.props.children}
      </main>)
  }
}
