import React from 'react';
import { connect } from 'react-redux';

import { getUserAccessToken } from "../../../utils/cookie";
import '../../../assets/scss/components/sticky_ads.scss';

import adsActions from '../../../redux/actions/adsActions';

class StickyAds extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      adsPath: props.path ? props.path : process.env.MODE === "PRODUCTION" ? "/21865661642/PRO_MIDDLE_MOBILE" : "/21865661642/RC_MIDDLE_MOBILE",
      adsId: props.id ? props.id : process.env.MODE === "PRODUCTION" ? "div-gpt-ad-1584677487159-0" : "div-gpt-ad-1584677577539-0"
    }
  }

  fetchAds(custParams) {
    const targettingAdsData = custParams.concat({
      name: "logged_in",
      value: String(Boolean(getUserAccessToken()))
    })

    window.googletag = window.googletag || {cmd: []}
    googletag.cmd.push(function() {
      googletag.defineSlot(this.state.adsPath, [320, 50], this.state.adsId).addService(googletag.pubads())

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
    googletag.cmd.push(function() { googletag.display(this.state.adsId) })
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
    return (
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
            <div id={this.state.adsId} style={{
              width: 320,
              height: 50
            }}>
            </div>
            </center>
          </div>
        </div>

      </div>
    )
  }
}

export default connect(state => state, adsActions)(StickyAds)
