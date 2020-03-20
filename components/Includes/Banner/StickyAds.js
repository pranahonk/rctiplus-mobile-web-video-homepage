import React from 'react';
import Router from 'next/router';
import Ad from 'react-google-publisher-tag';

//load home page scss
import '../../../assets/scss/components/sticky_ads.scss';

export default class StickyAds extends React.Component {
    render() {
        return (
            <div className="sticky-ads">
                <div className="sticky-ads-content">
                    <center>
                        {process.env.MODE == 'PRODUCTION' ? (
                            <Ad style="width:100%" className="stAds" id="ca-pub-8248966892082355" path="/21865661642/PRO_MIDDLE_MOBILE" formats="468x60" collapseEmpty="true" enableSingleRequest="true" data-full-width-responsive="true"/>
                            
                        ) : (
                            <Ad style="width:100%" className="stAds" id="ca-pub-8248966892082355" path="/21865661642/RC_MIDDLE_MOBILE" formats="468x60" collapseEmpty="true" enableSingleRequest="true" data-full-width-responsive="true"/>
                        )}
                    </center>
                </div>
            </div>
        );
    }
}