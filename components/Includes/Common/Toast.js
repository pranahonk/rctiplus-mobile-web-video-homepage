import React from 'react';
import '../../../assets/scss/components/toast.scss';
import Close from '@material-ui/icons/Close';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Countdown from 'react-countdown-now';
import { getCountdown } from '../../../utils/helpers';
import { appierAdsClicked } from '../../../utils/appier';
import { RPLUSAdsClicked } from '../../../utils/internalTracking';
import { SHARE_BASE_URL } from '../../../config';

const NOW = new Date();

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isclose: false,
      timeCount: props.data !== null ? getCountdown(props.data.end_date, NOW)[0] : 10000,
      isStatus:props.data !== null ? getCountdown(props.data.end_date, NOW)[1] : false,
    };
  }

  componentWillUnmount() {
    // this.props.callbackCount('12324234', this.state.timeCount, this.state.isStatus);
    this.setState({isClose: false});
  }
  componentDidUpdate() {
    let count = true;

    if (count) {
      // console.log('updateeee', this.state.isclose);
      if (this.props.data) {this.props.callbackCount(this.props.data.end_date, NOW);}
    }
    count = false;
  }

  getUrl(value) {
    switch (value.type) {
      // case 'program':
      //   return SHARE_BASE_URL + '/programs/' + value.content_id;
      // case 'episode':
      //   return SHARE_BASE_URL + '/programs/' + value.content_id + '/program-from-ads/episodes';
      // case 'extra':
      //   return SHARE_BASE_URL + '/programs/' + value.content_id + '/program-from-ads/extras';
      // case 'clip':
      //   return SHARE_BASE_URL + '/programs/' + value.content_id + '/program-from-ads/clips';
      case 'url':
        return value.webview_url;
      // case 'news':
      //   return SHARE_BASE_URL + '/trending';
      case 'roov':
        return SHARE_BASE_URL + '/radio';
      // case 'live_streaming':
      //   return SHARE_BASE_URL + '/tv/rcti';
      // case 'live_event':
      //   return SHARE_BASE_URL + '/live-event';
      default:
        return value.webview_url;
    }
  }

  completed() {
    // console.log('this countdown complete');
    this.props.count(true);
  }
  isRender({days, hours, minutes, seconds}) {
    // console.log(this.state.timeCount)
    // console.log(seconds);
    return (<div/>);
  }
  isClose() {
    this.setState({isclose: true});
    this.props.isAds(true);
  }
  render() {
    const { data } = this.props;
    return (
      <div>
          {
            this.state.isclose || !this.state.isStatus ? (<div/>) :
            (
              <div>
              <Countdown date={Date.now() + this.state.timeCount} onComplete={this.completed.bind(this)} renderer={this.isRender.bind(this)}/>
              <div className="toast-wrapper">
                <div className="toast-wrap-border">
                  <div className="toast-border" />
                </div>
                <ChevronRight fontSize="small" className="chevron-right"/>
                <div className="toast-close" onClick={this.isClose.bind(this)}>
                  <Close fontSize="small"/>
                </div>
                <div className="toast-content">
                  <span className="toast-content__time">{ data.time_diff }</span>
                  <h1 className="toast-content__title">{ data.sponsor_name }</h1>
                  <p className="toast-content__description" onClick={() => {
                    appierAdsClicked(data, 'sticky_ads_clicked', 'clicked');
                    RPLUSAdsClicked(data, 'click', 'sticky_ads_clicked', 'clicked')
                    window.open(this.getUrl(data),'_blank');
                    }}>{ data.description }</p>
                </div>
              </div>
              </div>)
            }
      </div>
    );
  }
}

export default Toast;
