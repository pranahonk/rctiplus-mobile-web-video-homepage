import React from 'react';
import AdsBanner from '../components/Includes/Banner/Ads';

class Dfp extends React.Component {
  render() {
    return(
      <div>
        <AdsBanner />
      </div>
    )
  }
}

export default Dfp;

// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import $ from 'jquery';

// const Dfp = ({path, size, idGpt, style}) => {
//   const [ads, setAds] = useState(null);

//   useEffect(() => {
//     const googletag = window.googletag || {};
//     window.googletag = window.googletag || {cmd: []};
//     googletag.cmd.push(function() {
//         const defineSlot = googletag.defineSlot(path, size, idGpt)
//         defineSlot.addService(googletag.pubads());
//         setAds(defineSlot)
//         console.log(ads)
//         console.log(defineSlot)
//         googletag.pubads().enableSingleRequest();
//         googletag.pubads().collapseEmptyDivs();

//         googletag.pubads().addEventListener('slotRenderEnded', function(event) {
//             if (event.isEmpty) {
//                 console.log('EMPTY ADS');
                
//             }
//         });
//         googletag.enableServices();
//     });
//     googletag.cmd.push(function() { googletag.display(idGpt); });
//   },[path, size, idGpt]);

//   useEffect(() => {
//     if(ads !== null) {
//       console.log(ads)
//     }
//   })
  

//   return (

//     <div id="ads-banner">
//     <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
//       <center>
//         <div id={idGpt} />
//       </center>
//     </div>
//   );
// };


// export default Dfp;

// Dfp.propTypes = {
//   path: PropTypes.string,
//   size: PropTypes.array,
//   idGpt: PropTypes.string,
//   style: PropTypes.object,
// };

// Dfp.defaultProps = {
//   path: '/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250',
//   size: [300, 250],
//   style: {
//     width: 300,
//     height: 250,
//   },
//   idGpt: 'div-gpt-ad-1591240670591-0',
// }



// import React from 'react';

// class Sample extends React.Component {

//   componentDidMount() {
//               window.googletag = window.googletag || {cmd: []};
//               googletag.cmd.push(function() {
//                   googletag.defineSlot('/21865661642/PRO_MOBILE_LIST-NEWS_DISPLAY_300x250', [300, 250],
//                   'div-gpt-ad-1591240670591-0').addService(googletag.pubads());
//                   googletag.pubads().enableSingleRequest();
//                   googletag.pubads().collapseEmptyDivs();

//                   googletag.pubads().addEventListener('slotRenderEnded', function(event) {
//                       if (event.isEmpty) {
//                           console.log('EMPTY ADS');
//                       }
//                   });
//                   googletag.enableServices();
//               });
//               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1591240670591-0'); });
      
//   }

//   render() {
//       return (
//           <div id="sticky-ads-container">
//               <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
//                   <div>
//                       <script dangerouslySetInnerHTML={{ __html: `
//                           window.googletag = window.googletag || {cmd: []};
//                           googletag.cmd.push(function() {
//                               googletag.defineSlot('/21865661642/RC_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1584677577539-0').addService(googletag.pubads());
//                               googletag.pubads().enableSingleRequest();
//                               googletag.pubads().collapseEmptyDivs();

//                               googletag.pubads().addEventListener('slotRenderEnded', function(event) {
//                                   if (event.isEmpty) {
//                                       document.getElementById('sticky-ads-container').style.display = 'none';
//                                       console.log('EMPTY ADS');
//                                   }
//                               });
//                               googletag.enableServices();
//                           });
//                       ` }}>
//                       </script>
//                       <div className="sticky-ads-content">
//                           <center>
//                           <div id='div-gpt-ad-1591240670591-0' style={{
//                               width: 300,
//                               height: 250,
//                           }}>
//                               <script dangerouslySetInnerHTML={{ __html: `
//                                   googletag.cmd.push(function() { googletag.display('div-gpt-ad-1584677577539-0'); });
//                               ` }}>
//                               </script>
//                           </div>
//                           </center>
//                       </div>
//                   </div>
//           </div>
//       );
//   }
// }

// export default Sample;