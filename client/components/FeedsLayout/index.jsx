import React from 'react'
import style from './style.css'

export default class FeedsLayout extends React.Component {
  render() {
    return (
      <div className={style.FeedsLayout}>
        {this.props.children}
      </div>
    )
  }
}

