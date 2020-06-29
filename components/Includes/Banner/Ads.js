import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
// import { useSelector, useDispatch } from 'react-redux';

const AdsBanner = ({path, size, idGpt, style, partner}) => {
  const [ads, setAds] = useState(null);
  const toggleAds = useSelector(state => state.ads)
  // const dispatch = useDispatch();
  useEffect(() => {
    const googletag = window.googletag || {};
    window.googletag = window.googletag || {cmd: []};
    googletag.cmd.push(function() {
        let  defineSlot;
        if(partner) {
          defineSlot = googletag.defineSlot(path, size, idGpt).setTargeting('partner_name', partner)
        } else {
          defineSlot = googletag.defineSlot(path, size, idGpt)
        }
        defineSlot.addService(googletag.pubads());
        setAds(defineSlot)
        console.log(ads)
        console.log(defineSlot)
        googletag.pubads().enableSingleRequest();
        googletag.pubads().collapseEmptyDivs();
        // dispatch({type: 'TOGGLE_ADS' , toggle: true})
        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            if (event.isEmpty) {
                // dispatch({type: 'TOGGLE_ADS', toggle: false})
                console.log('EMPTY ADS');
                
            }
        });
        googletag.enableServices();
    });
    googletag.cmd.push(function() { googletag.display(idGpt); });
  },[path, size, idGpt]);

  // useEffect(() => {
  //   if(ads !== null) {
  //     console.log('PROPS: ',toggleAds)

  //   }
  // })
  

  return (
    <div>
      <div id="ads-banner">
        <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
        <center>
          <div id={idGpt} />
        </center>
      </div>
    </div>
  );
};


export default AdsBanner;

AdsBanner.propTypes = {
  path: PropTypes.string,
  size: PropTypes.array,
  idGpt: PropTypes.string,
  partner: PropTypes.string,
  style: PropTypes.object,
};

AdsBanner.defaultProps = {
  path: '/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250',
  size: [300, 250],
  style: {
    width: 300,
    height: 250,
  },
  idGpt: 'div-gpt-ad-1591240670591-0',
  partner: null,
}