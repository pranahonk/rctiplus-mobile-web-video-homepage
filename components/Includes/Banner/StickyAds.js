import React from 'react';
import { connect } from 'react-redux';
import '../../../assets/scss/components/sticky_ads.scss';

import adsActions from '../../../redux/actions/adsActions';

class StickyAds extends React.Component {
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


  fetchAds(targetingAds) {
    const slotName = this.setPathID();
    const gptID = this.setGptId();

    let targettingAdsData = [];
    if(this.props.targettingAdsData?.length > 0){
      targettingAdsData = [...this.props.targettingAdsData];
    }


    window.googletag = window.googletag || {cmd: []}
    googletag.cmd.push(function() {
      googletag.defineSlot(slotName, [320, 50], gptID).addService(googletag.pubads());

      targetingAds.forEach(({ name, value }) => {
        googletag.pubads().setTargeting(name, value)
      })

      googletag.pubads().setTargeting(targettingAdsData[targettingAdsData.length - 1].name, targettingAdsData[targettingAdsData.length - 1].value)
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
    if(this.props.path){
      this.props.fetchTargetingAds()
        .then((res) =>this.fetchAds(res))
        .catch((_) => this.fetchAds([]))
    }

  }

  componentWillUnmount() {
    if (googletag.destroySlots){
      googletag.pubads().clearTargeting(), googletag.destroySlots()
    }
  }

  render() {
    return (
      this.props.path ?
        <div id="sticky-ads-container" className={`sticky-ads ${(this.props.sticky ? 'sticky-ads-on' : '')}`}>
          {this.props.sticky
            ? (
              <div
                className="ads-close-btn"
                onClick={() => this.props.toggleAds(false)}></div>
            )
            : null}
          <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>

          <div>
            <div className="sticky-ads-content">
              <center>
                <div id={this.setGptId()} style={{
                  width: 320,
                  height: 50
                }}>
                </div>
              </center>
            </div>
          </div>

        </div> : <div/>
    )
  }
}

StickyAds.defaultProps = {
  path: null,
  sticky: false,
  id: null
}

export default connect(state => state, adsActions)(StickyAds)
