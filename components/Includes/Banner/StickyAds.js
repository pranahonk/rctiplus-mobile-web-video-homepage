import React from 'react';
import { connect } from 'react-redux';

import '../../../assets/scss/components/sticky_ads.scss';

import adsActions from '../../../redux/actions/adsActions';

class StickyAds extends React.Component {
    state = {
        closed: false
    }

    fetchAds(custParams) {
        switch (process.env.MODE) {
            case 'PRODUCTION':
                window.googletag = window.googletag || { cmd: [] };
                googletag.cmd.push(function() {
                    googletag.defineSlot('/21865661642/PRO_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1584677487159-0').addService(googletag.pubads());
                    if (custParams.length > 0) {
                        for (const custParam of custParams) {
                            googletag.pubads().setTargeting(custParam.name, custParam.value);
                        }
                    }
                    googletag.pubads().enableSingleRequest();
                    googletag.pubads().collapseEmptyDivs();
                    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        if (event.isEmpty) {
                            document.getElementById('sticky-ads-container').style.display = 'none';
                        }
                    });
                    googletag.enableServices();
                });
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-1584677487159-0'); });
                break;

            case 'DEVELOPMENT':
                window.googletag = window.googletag || {cmd: []};
                googletag.cmd.push(function() {
                    googletag.defineSlot('/21865661642/RC_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1584677577539-0').addService(googletag.pubads());
                    if (custParams.length > 0) {
                        for (const custParam of custParams) {
                            googletag.pubads().setTargeting(custParam.name, custParam.value);
                        }
                    }
                    googletag.pubads().enableSingleRequest();
                    googletag.pubads().collapseEmptyDivs();

                    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        if (event.isEmpty) {
                            document.getElementById('sticky-ads-container').style.display = 'none';
                            console.log('EMPTY ADS');
                        }
                    });
                    googletag.enableServices();
                });
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-1584677577539-0'); });
                break;
        }
    }
    componentDidMount() {
        this.generateTargettingAdsData()
    }

    generateTargettingAdsData() {
        let targettingAdsData = [
            {
                name: "logged_in", 
                value : String(this.props.user.data !== null)
            }
        ]

        this.props.fetchTargetingAds()
            .then((res) => targettingAdsData = [ ...targettingAdsData, ...res ])
            .finally(() => this.fetchAds(targettingAdsData))
    }

    render() {
        return (
            <div id="sticky-ads-container" className={"sticky-ads " + (this.props.sticky ? 'sticky-ads-on' : '') + ' ' + (this.state.closed ? 'sticky-ads-off' : '')}>
                {this.props.sticky ? (
                    <div className="ads-close-btn" onClick={() => this.props.toggleAds(false)}>x</div>
                ) : null}
                <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
                {process.env.MODE == 'PRODUCTION' ? (
                    <div>
                        <div className="sticky-ads-content">
                            <center>
                            <div id='div-gpt-ad-1584677487159-0' style={{
                                width: 320,
                                height: 50
                            }}>
                            </div>
                            </center>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="sticky-ads-content">
                            <center>
                            <div id='div-gpt-ad-1584677577539-0' style={{
                                width: 320,
                                height: 50
                            }}>
                            </div>
                            </center>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(state => state, adsActions)(StickyAds);