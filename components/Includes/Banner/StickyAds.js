import React from 'react';
import Router from 'next/router';;
//load home page scss
import '../../../assets/scss/components/sticky_ads.scss';

export default class StickyAds extends React.Component {
    componentDidMount () {
        if(typeof window !== 'undefined'){
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    render() {
        return (
                <div className="sticky-ads">
                    <div className="sticky-ads-content">
                        <div id='div-gpt-ad-1576567416232-0'> 
                            <ins className='adsbygoogle' style={{ display: 'block', height: '90px', width:'90%'}} data-ad-client='div-gpt-ad-1576567416232-0' data-ad-slot='/21865661642/RC_STORY_WEB-MOBILE' data-ad-format='auto' data-full-width-responsive="true" />
                        </div>
                    </div>
                </div>
                );
    }
}