import React from 'react';
import AdsBanner from '../components/Includes/Banner/Ads';
import { GPT_ID_LIST, GPT_NEWS_ANDROID_LIST, GPT_NEWS_IOS_LIST, GPT_NEWS_MWEB_LIST } from '../config';
// import { isIOS, isAndroid } from "react-device-detect";
// import Layout from '../components/Layouts/Default_v2';
import queryString from 'query-string';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import newsv2Actions from '../redux/actions/newsv2Actions';
import adsActions from '../redux/actions/adsActions.js';
import {getNewsChannels} from "../utils/cookie";

class Dfp extends React.Component {


  constructor(props) {
    super(props);
    this.platform = null;
    this.idfa = null;
    const segments = this.props.router.asPath.split(/\?/);
    if (segments.length > 1) {
      const q = queryString.parse(segments[1]);
      if (q.platform) {
        this.platform = q.platform;
      }
      if(q.idfa){
        this.idfa = q.idfa;
      }
    }
  }


  render() {
    return (
      <div>
        <AdsBanner path={getPlatformGpt(this.platform)} idGpt={GPT_ID_LIST} setTarget={true} platform={this.platform} idfa={this.idfa}  />
      </div>
    );
  }
}
export default connect(state => state, {
  ...adsActions,
  ...newsv2Actions,
})(withRouter(Dfp));

const getPlatformGpt = (platform) => {
  // webview
  if (platform === 'ios') {
    return GPT_NEWS_IOS_LIST;
  }
  else if (platform === 'android') {
    return GPT_NEWS_ANDROID_LIST;
  }
  else {
    return  GPT_NEWS_MWEB_LIST;
  }
};

