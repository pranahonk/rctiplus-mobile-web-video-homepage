import React from 'react';
import AdsBanner from '../components/Includes/Banner/Ads';
import isWebview from 'is-ua-webview';
import { GPT_ID_LIST, GPT_NEWS_IOS_LIST, GPT_NEWS_ANDROID_LIST, GPT_NEWS_MWEB_LIST } from '../config'
// import { isIOS, isAndroid } from "react-device-detect";
// import Layout from '../components/Layouts/Default_v2';
import queryString from 'query-string';
import Router, { withRouter } from 'next/router';

class Dfp extends React.Component {
  constructor(props) {
    super(props);
    this.platform = null;
    const segments = this.props.router.asPath.split(/\?/);
    if (segments.length > 1) {
        const q = queryString.parse(segments[1]);
        if (q.platform) {
            this.platform = q.platform;
        }
    }
}
  render() {
    return(
      <div>
        <AdsBanner path={getPlatformGpt(this.platform)} idGpt={GPT_ID_LIST} />
      </div>
    )
  }
}

export default withRouter(Dfp);

const getPlatformGpt = (platform) => {
  // webview
  switch (platform) {
    case platform === 'ios':
      return GPT_NEWS_IOS_LIST;
    case platform === 'android':
      return GPT_NEWS_ANDROID_LIST;
    default:
      return GPT_NEWS_MWEB_LIST;
  }
  //   if(platform === 'ios') {
  //     // console.log('ISO')
  //     return GPT_NEWS_IOS_LIST;
  //     // return '/21865661642/PRO_IOS-APP_LIST-NEWS_DISPLAY_300x250'
  //     // return '/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250'
  //   }
  //   if(platform === 'android') {
  //     // console.log('ANDROID')
  //     return GPT_NEWS_ANDROID_LIST;
  //     // return '/21865661642/PRO_ANDROID-APP_LIST-NEWS_DISPLAY_300x250'
  //     // return '/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250'
  //   }
  // // native browser
  // if(!isWebview('Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Mobile Safari/537.36')) {
  //   // console.log('NATIVE')
  //   // return '/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250'
  //   return GPT_NEWS_MWEB_LIST;
  // }
}
