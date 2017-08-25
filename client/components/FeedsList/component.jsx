import React from 'react'
import styles from './style.css'


export default class FeedsList extends React.Component {
  render() {
    const { selectedFeedsGroup } = this.props.feeds
    
    let channels
    let channelsFlat = []
    if (selectedFeedsGroup) {
      channels = JSON.parse(this.props.feeds[selectedFeedsGroup])
      const todayDate = (new Date).toISOString().split('T')[0]

      channels.forEach(channel => {
        channel.entries.forEach(entry => {
          const {published, title, viewes, videoId} = entry
          channelsFlat.push(
            FeedsItem({published, title, viewes, videoId, channel})
          )
          if (todayDate === published.split('T')[0]) { 
            console.log(todayDate === published.split('T')[0])
            // channelsFlat.push(
            //   FeedsItem({published, title, viewes, videoId, channel})
            // )
          }

        })
      })      
    }

    console.log(channelsFlat)
    return (
      <ul className={styles.FeedsList}>
        {channelsFlat}  
      </ul>)
  }
}


const FeedsItem = ({published, title, viewes, videoId, channel}) => {
  return <li className={styles['FeedsList--item']}>
    <img src={`https://i3.ytimg.com/vi/${videoId}/default.jpg`} alt=""/>
    <div className="details">
        <a href="#">
          <h3>{title}</h3>
        </a>
    </div>
    <div className={styles.metadata}>
      <div><a href="#">{channel.channelName}</a></div>
      <div><span>{viewes} views</span> <span>{published.split('T')[0]}</span></div>
    </div>
  </li>
}

{/* <ul className={styles.FeedsList}>
  <li className={styles['FeedsList--item']}>
    <img src={placeholderImg} alt=""/>
    <div className="details">
        <a href="#">
          <h3>VERY Brie Larson with Craig Ferguson! (BFF's)</h3>
        </a>
    </div>
    <div className={styles.metadata}>
      <div><a href="#">The Stories Of Craig</a></div>
      <div><span>176 views</span> <span>3 hours ago</span></div>
    </div>
  </li>
</ul>  */}