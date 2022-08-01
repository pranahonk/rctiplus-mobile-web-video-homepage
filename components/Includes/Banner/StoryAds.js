import React from 'react'
import { connect } from 'react-redux'

import { getUserAccessToken } from "../../../utils/cookie"
import '../../../assets/scss/components/story_ads.scss'

import adsActions from '../../../redux/actions/adsActions'

class StoryAds extends React.Component {
  fetchAds(custParams) {
    const slotName = this.props.path
    const gptID = this.props.id
    const target = this.props.target
    const targettingAdsData = custParams.concat({
      name: "logged_in",
      value: String(Boolean(getUserAccessToken()))
    })

    

    window.googletag = window.googletag || {cmd: []}
    googletag.cmd.push(function() {
      googletag.defineSlot(slotName, ['fluid'], gptID).addService(googletag.pubads())

      target.forEach(({ name, value }) => {
        googletag.pubads().setTargeting(name, value)
      })

      googletag.pubads().enableSingleRequest()
      googletag.pubads().collapseEmptyDivs()

      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if (event.isEmpty) {
          document.getElementById('story-ads-container').style.display = 'none'
        }
      })
      googletag.enableServices()
    })
    googletag.cmd.push(function() { googletag.display(gptID) })

  }

  componentDidMount() {
    // this.props.fetchTargetingAds()
    //   .then((res) => this.fetchAds(res))
    //   .catch((_) => this.fetchAds([]))
  }

  componentWillUnmount() {
    if (googletag.destroySlots) googletag.destroySlots()
  }
  

  render() {
    const gptID = this.props.id

    return (
      <div 
        id="story-ads-container" 
        className={`story-ads ${(this.props.sticky ? 'story-ads-on' : '')}`}
        >
        <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
        
 
        <div className="story-ads-content">
          <div 
            id={gptID} 
            style={{
              width: '100%',
              height: '100%'
            }}
          >
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => state, adsActions)(StoryAds)
