import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {GPT_NEWS_LINK_LIST, GPT_NEWS_LINK_DETAIL, DEV_API} from '../../../config';
import {connect} from 'react-redux';
import adsActions from '../../../redux/actions/adsActions';
import ax from "axios";
import { getUidAppier } from '../../../utils/appier';
// import $ from 'jquery';
// import { useSelector, useDispatch } from 'react-redux';


const axios = ax.create({ baseURL: DEV_API });
const AdsBanner = ({path, size, idGpt, style, partner, setTarget}) => {
  const [ads, setAds] = useState(null);
  const [url, setUrl] = useState(null);
  // const toggleAds = useSelector(state => state.ads)
  // const dispatch = useDispatch();


  const showAds = (custParams) =>{
    const googletag = window.googletag || {};
    window.googletag = window.googletag || {cmd: []};
    googletag?.cmd?.push(function() {
      let  defineSlot;
      if ((setTarget && partner) || setTarget) {
        defineSlot = googletag.defineSlot(path, size, idGpt).addService(googletag.pubads());
        if (partner){
          googletag.pubads().setTargeting('partner_name', partner);
        }
        if (custParams.length > 0) {
          for (const custParam of custParams) {
            googletag.pubads().setTargeting(custParam.name, custParam.value);
          }
        }
      }
      else if (partner) {
        defineSlot = googletag.defineSlot(path, size, idGpt).setTargeting('partner_name', partner);
      }
      else {
        defineSlot = googletag.defineSlot(path, size, idGpt);
      }
      defineSlot.addService(googletag.pubads());
      setAds(defineSlot);
      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      // dispatch({type: 'TOGGLE_ADS' , toggle: true})
      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        // const elmnt = document.getElementById('google_ads_iframe_/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250_0');
        // const elmntDetail = document.getElementById('google_ads_iframe_/21865661642/PRO_MOBILE_DETAIL-NEWS_DISPLAY_300x250_0');
        const elmnt = document.getElementById(GPT_NEWS_LINK_LIST);
        const elmntDetail = document.getElementById(GPT_NEWS_LINK_DETAIL);
        if (typeof (elmnt) !== 'undefined' && elmnt !== null) {
          // console.log(elmnt);
          setUrl(elmnt.contentWindow.document.getElementsByTagName('a')[0].href);
        }
        else if (elmntDetail) {
          // console.log(elmntDetail.contentWindow.document.getElementsByTagName('a')[0].href);
          setUrl(elmntDetail.contentWindow.document.getElementsByTagName('a')[0].href);
        }
        if (event.isEmpty) {
          // dispatch({type: 'TOGGLE_ADS', toggle: false})
          console.log('EMPTY ADS');

        }
      });
      googletag.enableServices();
    });
    googletag?.cmd?.push(function() { googletag.display(idGpt); });
  };

  useEffect(() => {
    axios.get(`/ads/v1/cust-params?platform=mweb&aid=${getUidAppier()}`)
      .then(response => {
        showAds(response.data);
      })
      .catch(
        (error) => {
          console.error(error)
        }
      );
  },[]);

  // useEffect(() => {
  //   if(ads !== null) {
  //     console.log('PROPS: ',toggleAds)

  //   }
  // })


  return (
    <div>
      <div id="ads-banner" style={{ position: 'relative' }}>
        <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
        <center>
          <div id={idGpt} />
        </center>
        { url ? (
          <div style={{ position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0' }}
          onClick={() => window.open(url, '_blank')} />
        ) : (<div />) }
      </div>
    </div>
  );
};

AdsBanner.getInitialProps = async ({ req }) => {
  const res = await axios.get(`/ads/v1/cust-params?platform=mweb&aid=${getUidAppier()}`);
  console.log(res);
  // return { stars: json.stargazers_count }
}



export default AdsBanner;

AdsBanner.propTypes = {
  path: PropTypes.string,
  size: PropTypes.array,
  idGpt: PropTypes.string,
  partner: PropTypes.string,
  style: PropTypes.object,
};

AdsBanner.defaultProps = {
  path: '',
  size: [300, 250],
  style: {
    width: 300,
    height: 250,
  },
  idGpt: '',
  partner: null,
};
