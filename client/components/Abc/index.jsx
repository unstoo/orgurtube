import styles from './Abc.css'
import React from 'react'
import {connect} from 'react-redux'
import fetchStuff from '../../actions/api'

const Abc = (props) => {

  return (
  <div className={styles.red}>
    <span className="input-group-btn">
      <button onClick={props.onClick} className="btn btn-default" type="button">Yay!</button>
    </span>
    <input type="text" className="form-control" placeholder="Yay for..."/>     
</div>)
}


const mapDispatchToProps = (dspatch) => {
  return {
    onClick: () => {
      dspatch(fetchStuff())
    }
  }
}

export default connect(null, mapDispatchToProps)(Abc)
