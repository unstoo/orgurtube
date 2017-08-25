import React from 'react'
import style from './style.css'
import FeedsList from '../FeedsList'

export default class Feeds extends React.Component {
  render() {
    return (
      <div className={style.Feeds_overflow}>
      <section className={style.Feeds}>
        {/* TODO: Changes header to selected group. */}
        <header><h2>Feeds</h2></header>        
        <FeedsList/>
      </section>
      </div>)
  }
}

