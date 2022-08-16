import React from 'react';
import { connect } from 'react-redux';
import '../../../assets/scss/components/story_ads.scss';

import adsActions from '../../../redux/actions/adsActions';

class StoryAds extends React.Component {
  constructor(props) {
    super(props);
  }

  setPathID(){
    const slotName = process.env.MODE === "PRODUCTION" ? "/21865661642/PRO_MIDDLE_MOBILE" : "/21865661642/RC_MIDDLE_MOBILE";
    return  this.props.path ? this.props.path : slotName;
  }

  setGptId(){
    const gptID = process.env.MODE === "PRODUCTION" ? "div-gpt-ad-1584677487159-0" : "div-gpt-ad-1584677577539-0";
    return  this.props.id ? this.props.id : gptID;
  }


  fetchAds() {
    const slotName = this.setPathID();
    const gptID = this.setGptId();

    let targettingAdsData;
    if(this.props.targettingAdsData?.length === 1){
      targettingAdsData = [...this.props.targettingAdsData];
    }
    else if (this.props.targettingAdsData?.length > 1){
      targettingAdsData =  [...this.props.targettingAdsData];
      targettingAdsData.shift();
    }
    else{
      targettingAdsData = this.props.targettingAdsData;
    }

    window.googletag = window.googletag || {cmd: []}
    googletag.cmd.push(function() {
      googletag.defineSlot(slotName, [320, 50], gptID).addService(googletag.pubads())

      targettingAdsData.forEach(({ name, value }) => {
        googletag.pubads().setTargeting(name, value)
      })

      googletag.pubads().enableSingleRequest()
      googletag.pubads().collapseEmptyDivs()

      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if (event.isEmpty) {
          document.getElementById('sticky-ads-container').style.display = 'none'
        }
      })
      googletag.enableServices()
    })
    googletag.cmd.push(function() { googletag.display(gptID) })
  }

  componentDidMount() {
    this.props.fetchTargetingAds()
      .then((res) => this.fetchAds(res))
      .catch((_) => this.fetchAds([]))
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
            id={this.setGptId()}
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
