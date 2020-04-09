import React from 'react';
import { connect } from 'react-redux';

import '../../../assets/scss/components/sticky_ads.scss';

import adsActions from '../../../redux/actions/adsActions';

class StickyAds extends React.Component {
    state = {
        closed: false
    };

    render() {
        return (
            <div id="sticky-ads-container" className={"sticky-ads " + (this.props.sticky ? 'sticky-ads-on' : '') + ' ' + (this.state.closed ? 'sticky-ads-off' : '')}>
                {this.props.sticky ? (
                    <div className="ads-close-btn" onClick={() => this.props.toggleAds(false)}>x</div>
                ) : null}
                <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
                {process.env.MODE == 'PRODUCTION' ? (
                    <div>
                        <script dangerouslySetInnerHTML={{ __html: `
                            window.googletag = window.googletag || {cmd: []};
                            googletag.cmd.push(function() {
                                googletag.defineSlot('/21865661642/PRO_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1584677487159-0').addService(googletag.pubads());
                                googletag.pubads().enableSingleRequest();
                                googletag.pubads().collapseEmptyDivs();
                                googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                                    if (event.isEmpty) {
                                        document.getElementById('sticky-ads-container').style.display = 'none';
                                    }
                                });
                                googletag.enableServices();
                            });
                        ` }}>
                        </script>
                        <div className="sticky-ads-content">
                            <center>
                            <div id='div-gpt-ad-1584677487159-0' style={{
                                width: 320,
                                height: 50
                            }}>
                                <script dangerouslySetInnerHTML={{ __html: `
                                    googletag.cmd.push(function() { googletag.display('div-gpt-ad-1584677487159-0'); });
                                ` }}>
                                </script>
                            </div>
                            </center>
                        </div>
                    </div>
                ) : (
                    <div>
                        <script dangerouslySetInnerHTML={{ __html: `
                            window.googletag = window.googletag || {cmd: []};
                            googletag.cmd.push(function() {
                                googletag.defineSlot('/21865661642/RC_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1584677577539-0').addService(googletag.pubads());
                                googletag.pubads().enableSingleRequest();
                                googletag.pubads().collapseEmptyDivs();
                                googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                                    if (event.isEmpty) {
                                        document.getElementById('sticky-ads-container').style.display = 'none';
                                    }
                                });
                                googletag.enableServices();
                            });
                        ` }}>
                        </script>
                        <div className="sticky-ads-content">
                            <center>
                            <div id='div-gpt-ad-1584677577539-0' style={{
                                width: 320,
                                height: 50
                            }}>
                                <script dangerouslySetInnerHTML={{ __html: `
                                    googletag.cmd.push(function() { googletag.display('div-gpt-ad-1584677577539-0'); });
                                ` }}>
                                </script>
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