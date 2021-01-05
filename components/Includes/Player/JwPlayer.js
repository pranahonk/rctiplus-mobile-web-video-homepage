import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { convivaJwPlayer} from '../../../utils/conviva';
import { getUserId } from '../../../utils/appier';
import { onTrackingClick } from '../program-detail/programDetail';
import { isIOS } from 'react-device-detect';
import Wrench from '../Common/Wrench';
import { Offline, Online } from 'react-detect-offline';
import '../../../assets/scss/jwplayer.scss';

const pubAdsRefreshInterval = {
  timeObject: null,
  timeStart: 0,
};

let refreshCounter = 0;

const JwPlayer = (props) => {
  const [player, setPlayer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isCustomSetup, setIsCustomSetup] = useState(0);
  const [isConviva, setIsConviva] = useState(0);
  const [geoblock, setGeoblock] = useState();
  const [random1, setrandom1] = useState(0);
  const [status, setStatus] = useState({
    isPlayer: true,
    isError01: false,
    isError02: false,
    isError03: false,
    isError04: false,
    isError05: false,
    isError06: false,
    isError07: false,
    isError08: false,
  });
  const [adsStatus, setAdStatus] = useState('none');
  const [playerFullscreen, setPlayerFullscreen] = useState(false);
  const [prevWidth, setPrevWidth] = useState(0);
  const playerRef = useRef();
  const val = useRef();
  const idPlayer = 'jwplayer-rctiplus';
  const options = {
    autostart: true,
    mute: false,
    floating: false,
    file: props.data && props.data.url,
    primary: 'html5',
    width: '100%',
    hlsjsdefault: true,
    aspectratio: '16:9',
    displaytitle: true,
    setFullscreen: true,
    stretching: 'uniform',
    height: 180,
    advertising: {
      client: process.env.ADVERTISING_CLIENT,
      tag: props.data && props.data.vmap_ima,
    },
    skin: {
      name: 'rplus_player',
    },
    logo: {
      hide: true,
    },
  };

  // Initial Setup
  useEffect(() => {
    const jwplayer = window.jwplayer(idPlayer);
    // console.log('EFFECT INIT 1', props);
    if (props.geoblockStatus) {
      setStatus({
        isPlayer: false,
        isError01: true,
      });
    }
    setPlayer(jwplayer);
    if (props.data && props.data.url) {
      setIsConviva(Math.random());
      // setIsCustomSetup(Math.random());
      jwplayer.setup(options);
    }
    return () => {
      if (player !== null) {
        // console.log('DISPOSEEEEEE');
        jwplayer.remove();
      }
    };
  }, []);

  // Update Setup
  useEffect(() => {

    // console.log('EFFECT INIT 2');
    if (player !== null) {
      setIsConviva(Math.random());
      setIsCustomSetup(Math.random());
      player.setup(options);
      // console.log('PLAYERRRR : ',props.data)
      // console.log('ISLOGIN : ', props.customData && props.customData.isLogin)
    }
  }, [props.data && props.data.url, props.data && props.data.vmap]);

  // Costum Setup
  useEffect(() => {
    // console.log('EFFECT INIT 3');
    // console.log('PLAYER GET DATA: ',props, player);
    if (player !== null) {
      player.on('ready', (event) => {
        if (props.isFullscreen) {
          player.setFullscreen(true);
          setPlayerFullscreen(true);
        }
        const playerContainer = player.getContainer();
        const fowardContainer = playerContainer.querySelector('.jw-icon-next');
        const backwardContainer = playerContainer.querySelector('.jw-icon-rewind');
        const isLiveContainer = playerContainer.querySelector('.jw-dvr-live');
        const isForward = playerContainer.querySelector('.jw-rplus-forward');
        if(isForward) {
          const forwardElement = document.createElement('div');
          forwardElement.classList.add('jw-rplus-forward');
          forwardElement.innerHTML = foward10;
          // const iconForward = document.querySelector('.icon-forward');
          forwardElement.addEventListener('dblclick', (ev) => {
            // console.log('TOUCH:', ev);
            // iconForward.classList.add('animated', 'fadeInRight', 'go');
            setTimeout(() => {
              // iconForward.classList.remove('animated', 'fadeInRight', 'go');
              forwardElement.style.opacity = 0;
            }, 900);
          });
          playerContainer.append(forwardElement);
        }
        // console.log('LIVEEE', isLiveContainer);
        if (props.type !== 'live tv' || props.type !== 'live event') {
          fowardContainer.innerHTML = foward10Icon;
          backwardContainer.innerHTML = backward10Icon;
          fowardContainer.addEventListener('touchstart', () => {
            player.seek(player.getPosition() + 10);
          });
        }

        if (props.type === 'live tv' || props.type === 'live event') {
          // console.log(fowardContainer);
          fowardContainer.style.display = 'none'
          backwardContainer.style.display = 'none'
          fowardContainer.innerHTML = '';
          backwardContainer.innerHTML = '';

          // check if gpt data exist
          if ((props.data && props.data.gpt && props.data.gpt.path != null) && (props.data && props.data.gpt && props.data.gpt.path != undefined)) {
            // check if ads_wrapper element not exist
            if (document.querySelector('.ads_wrapper') == undefined) {
              // console.log('data gpt', props.data.gpt);
              const playerContainer = player.getContainer();

              const adsOverlayElement = document.createElement('div');
              adsOverlayElement.classList.add('ads_wrapper');
              adsOverlayElement.style.display = 'none';

              const adsOverlayBox = document.createElement('div');
              adsOverlayBox.classList.add('adsStyling');

              const adsOverlayCloseButton = document.createElement('div');
              adsOverlayCloseButton.classList.add('close_button');
              adsOverlayCloseButton.innerHTML = closeIcon;

              const adsOverlayContainer = document.createElement('div');
              const divGPTString = (props.data && props.data.gpt && props.data.gpt.div_gpt != null) && (props.data && props.data.gpt && props.data.gpt.div_gpt != undefined) ? props.data.gpt.div_gpt : props.type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV_DIV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV;
              adsOverlayContainer.classList.add('adsContainer');
              adsOverlayContainer.id = divGPTString;
              adsOverlayContainer.innerHTML = `<script>googletag.cmd.push(function() { googletag.display('${divGPTString}'); });</script>`;

              playerContainer.appendChild(adsOverlayElement);
              adsOverlayElement.appendChild(adsOverlayBox);
              adsOverlayBox.appendChild(adsOverlayCloseButton);
              adsOverlayBox.appendChild(adsOverlayContainer);

              adsOverlayCloseButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                pubAdsRefreshInterval.timeStart = 0;
                setAdStatus('close');
              });
            }
          }
        }
        if (isIOS) {
          const elementCreateMute = document.createElement('btn');
          const elementMuteIcon = document.createElement('span');
          elementCreateMute.classList.add('jwplayer-vol-off');
          elementCreateMute.innerText = 'Tap to unmute ';

          player.setMute(true);
          if(document.getElementsByClassName('jwplayer-vol-off').length === 0) {
            playerContainer.appendChild(elementCreateMute);
            elementCreateMute.appendChild(elementMuteIcon);
          }
          const elementJwplayer = document.getElementsByClassName('jwplayer-vol-off');
          elementCreateMute.addEventListener('click', () => {
            if (elementCreateMute === null) {
              player.setMute(true);
              elementJwplayer[0].classList.add('jwplayer-mute');
              elementJwplayer[0].classList.remove('jwplayer-full');
            }
            else {
              player.setMute(false);
              elementCreateMute.classList.add('jwplayer-full');
              elementCreateMute.classList.remove('jwplayer-mute');
            }
          });
        }
        player.seek(props.data.last_duration);
      });
      player.on('mute', function() {
        const elementJwplayer = document.getElementsByClassName('jwplayer-vol-off');
        if (elementJwplayer[0] !== undefined) {
          if (player.getMute()) {
            elementJwplayer[0].classList.add('jwplayer-mute');
            elementJwplayer[0].classList.remove('jwplayer-full');
          } else {
            elementJwplayer[0].classList.add('jwplayer-full');
            elementJwplayer[0].classList.remove('jwplayer-mute');
          }
        }
      });
      player.on('play', () =>{
        // console.log('PLAYING');
        convivaJwPlayer().playing();
        if (document.querySelector('.ads_wrapper')) {
          if (document.querySelector('.ads_wrapper').style.display == 'none') {
            if (adsStatus === 'prestart') {
              setAdStatus('start');
            } else if (adsStatus === 'none') {
              setAdStatus('start');
            }
          }
        }
      });
      player.on('pause', () =>{
        // console.log('EFFECT INIT 4 CONTINUE WATCHING PAUSE', test)
        // console.log('PAUSE');
        convivaJwPlayer().pause();
      });
      player.on('buffer', (event) =>{
        // console.log('BUFFER', event);
        convivaJwPlayer().buffer();
      });
      player.on('adError', (event) => {
        // console.log('ERRRRRORRR', event);
      });
      player.on('time', (event) => {
        // console.log('duration:', event.currentTime);
        setDuration(player.getPosition());
      });
      player.on('complete', (event) => {
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
      });
      player.on('fullscreen', (event) => {
        if (event.fullscreen) {
          if (!playerFullscreen) {
            setPlayerFullscreen(true);
          }
        } else {
          if (playerFullscreen) {
            setPlayerFullscreen(false);
          }
        }
      });
      // ads event
      player.on('adImpression', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          setAdStatus('none');
        }
      });
      player.on('adSkipped', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          if (adsStatus === 'none') {
            setAdStatus('prestart');
          }
        }
      });
      player.on('adComplete', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          if (adsStatus === 'none') {
            setAdStatus('prestart');
          }
        }
      });
      player.on('userActive', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          document.querySelector('.ads_wrapper').style.bottom = '70px';
        }
      });
      player.on('userInactive', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          document.querySelector('.ads_wrapper').style.bottom = '5px';
        }
      });
      window.addEventListener('resize', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          if (adsStatus === 'idle' || adsStatus === 'close') {
            setAdStatus('restart');
          }
        }
      });
    }
  },);


  useEffect(() => {
    const containerElement = document.getElementsByClassName('rplus-jw-container');
    if (player !== null) {
      player.on('error', (event) => {
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        console.log('ERRORR',props.data.url)
        if (props.data.url === 'error') {
          setStatus({
            isPlayer: false,
            isError01: true,
          });
          player.remove();
          return false;
        }
        setStatus({
          isPlayer: false,
          isError01: false,
          isError02: true,
        });
        player.remove();
      });
      player.on('setupError', (event) => {
        // console.log('PLAYER SETUP ERROR', event);
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        if (props.data.url === 'error') {
          setStatus({
            isPlayer: false,
            isError01: true,
          });
          player.remove();
          return false;
        }
        setStatus({
          isPlayer: false,
          isError01: false,
          isError02: true,
        });
        player.remove();
      });
    }
  });
  // Continue Watching

  useEffect(() => {
    // console.log('EFFECT INIT 4 CONTINUE WATCHING', duration, props.customData && props.customData.isLogin);
    // val.current = props;
    if(props.customData && props.customData.isLogin && props.isResume && (props.data && props.data.id)) {
      props.onResume(props.data.id, props.data.content_type, duration);
    }
    // return () => {
    //   if (window.convivaVideoAnalytics) {
    //     const convivaTracker = convivaJwPlayer();
    //     convivaTracker.cleanUpSession();
    //     // console.log('RELESE FROM');
    //   }

    //   if (props.isResume && (props.data && props.data.id)) {
    //     console.log('EFFECT INIT 4 CONTINUE WATCHING CLEANUP :', player);
    //     props.onResume(props.data.id, props.data.content_type, duration);
    //   }
    // };
  }, [isCustomSetup]);

  useEffect(() => {
    let ab = 0
    if(player !== null) {
      player.on('time', (event) => {
        // setDuration(player.getPosition());
        ab = event.currentTime
        // console.log('EFFECT INIT 4 CONTINUE WATCHING CLEANUP', ab)
      });
    }
    return () => {
      // console.log('EFFECT INIT 4 CONTINUE WATCHING CLEANUP', ab)
      if (window.convivaVideoAnalytics) {
        const convivaTracker = convivaJwPlayer();
        convivaTracker.cleanUpSession();
        // console.log('RELESE FROM');
      }

      if (props.isResume && (props.data && props.data.id)) {
        // console.log('EFFECT INIT 4 CONTINUE WATCHING CLEANUP :', ab);
        props.onResume(props.data.id, props.data.content_type, ab);
      }
    };
  }, [player])

  // geoblock
  useEffect(() => {
    if (props.geoblockStatus) {
      if (player !== null) {
        props.data.url = 'error';
      }
    }
  }, [props.geoblockStatus]);
  // Conviva Tracker
  useEffect(() => {
    if (props.data) {
      // console.log('EFFECT INIT 5');
      let genreTags = 'N/A';
      if (props.data && props.data.genre) {
          if (Array.isArray(props.data.genre)) {
              genreTags = '';
              const genres = props.data.genre;
              for (let i = 0; i < genres.length; i++) {
                  genreTags += genres[i].name;
                  if (i < genres.length - 1) {
                      genreTags += ',';
                  }
              }
          }
          else {
              genreTags = props.data.genre;
          }
      }
      const optionsConviva = {
        assetName : props.type === 'live tv' ?
                    tempId(props.data && props.data.id)[1] :
                    props.type === 'live event' || props.type === 'missed event' ?
                    props.data && props.data.assets_name :
                    props.type === 'catch up tv' ?
                    props.data.title :
                    props.data && props.data.content_name ? props.data.content_name : 'N/A',
        content_type: props.type === 'live tv' || props.type === 'catch up tv' || props.type === 'live event' || props.type === 'missed event' ?
                      props.type : props.data && props.data.content_type ? props.data && props.data.content_type : 'N/A',
        content_id: props.type === 'live tv' ?
                    'N/A' :
                    props.type === 'catch up tv' ?
                    (props.data.id).toString() :
                    (props.data.id ? props.data.id : 'N/A').toString(),
        program_name: props.type === 'live tv' || props.type === 'catch up tv' ?
                    'N/A' :
                    props.type === 'live event' || props.type === 'missed event' ?
                    props.customData.program_name :
                    (props.data.program_title ? props.data.program_title : 'N/A'),
        program_id: props.type === 'live tv' || props.type === 'catch up tv' ?
                    'N/A' : (props.data.program_id ? props.data.program_id : 'N/A').toString(),
        tv_id: props.type === 'live tv' ?
                    (props.data && props.data.id && props.data.id.toString()) :
                    props.type === 'catch up tv' ?
                    tempId(props.data.channel)[0] :
                    (props.data.tv_id ? props.data.tv_id : 'N/A'),
        tv_name: props.type === 'live tv' ?
                    tempId(props.data && props.data.id)[1] :
                    props.type === 'catch up tv' ?
                    tempId(props.data.channel)[0] :
                    (props.data.tv_name ? props.data.tv_name : 'N/A'),
      };
      // const assetName = props.data && props.data.content_name ? props.data.content_name : 'N/A';
      const customTags = {
        app_version: process.env.APP_VERSION,
        carrier: 'N/A',
        connection_type: 'N/A',
        content_type: optionsConviva.content_type,
        content_id: optionsConviva.content_id,
        program_name: optionsConviva.program_name,
        tv_id: optionsConviva.tv_id,
        tv_name: optionsConviva.tv_name,
        date_video: 'N/A',
        page_title: 'N/A',
        page_view: 'N/A',
        program_id: optionsConviva.program_id,
        screen_mode: 'portrait',
        time_video: 'N/A',
        section_page: props.customData.sectionPage,
        application_name: process.env.MODE === 'DEVELOPMENT' ? 'RCTI+ MWEB RC' : 'RCTI+ MWEB',
        genre: genreTags,
        is_login: props.customData && props.customData.isLogin ? 'login' : 'not login',
        program_type: props.customData && props.customData.programType ? props.customData.programType : 'N/A',
      };
      if (player !== null) {
        // console.log('CONVIVA TAGS: ',optionsConviva);
        const convivaTracker = convivaJwPlayer(optionsConviva.assetName, player, player.getDuration(), props.data.url ? props.data.url : props.data.trailer_url, customTags, 'Anevia', getLive(props.type));
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        convivaTracker.createSession();
      }
      // console.log('CONVIVA PLAYER', window.convivaVideoAnalytics);
    }
  }, [isConviva]);

  // ads overlay
  useEffect(() => {
    if (player !== null) {
      let windowWidth = document.documentElement.clientWidth;
      let slotName = props.data.gpt.path != null && props.data.gpt.path != undefined ? props.data.gpt.path : props.type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT;
      let slotDiv = props.data.gpt.div_gpt != null && props.data.gpt.div_gpt != undefined ? props.data.gpt.div_gpt : props.type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV_DIV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV;
      let intervalTime = props.data.gpt.interval_gpt != null && props.data.gpt.interval_gpt != undefined ? props.data.gpt.interval_gpt : props.adsOverlayData.reloadDuration;
      let minWidth = props.data.gpt.size_width_1 != null && props.data.gpt.size_width_1 != undefined ? props.data.gpt.size_width_1 : 320;
      let maxWidth = props.data.gpt.size_width_2 != null && props.data.gpt.size_width_2 != undefined ? props.data.gpt.size_width_2 : 468;
      let minHeight = props.data.gpt.size_height_1 != null && props.data.gpt.size_height_1 != undefined ? props.data.gpt.size_height_1 : 50;
      let maxHeight = props.data.gpt.size_height_2 != null && props.data.gpt.size_height_2 != undefined ? props.data.gpt.size_height_2 : 60;

      if (adsStatus === 'start') {
        clearTimeout(pubAdsRefreshInterval.timeObject);

        if (document.querySelector('.ads_wrapper')) {
          googletag.destroySlots();
          window.googletag = window.googletag || { cmd: [] };
          googletag.cmd.push(function () {
            const mappingSlot = googletag.sizeMapping().addSize([(maxWidth + 15), maxHeight], [maxWidth, maxHeight]).addSize([0, 0], [minWidth, minHeight]).build();

            googletag.defineSlot(slotName, [[maxWidth, maxHeight], [minWidth, minHeight]], slotDiv)
            .defineSizeMapping(mappingSlot)
            .addService(googletag.pubads())
            .setTargeting('logged_in', props.customData && props.customData.isLogin.toString())
            .setTargeting('channel_id', props.data && props.data.id)
            .setTargeting('program_title', props.type === 'live tv' ?
            tempId(props.data && props.data.id)[1] :
            props.type === 'live event' || props.type === 'missed event' ?
            props.data && props.data.assets_name : 'NOT_SET');
            googletag.pubads().enableSingleRequest();
            googletag.pubads().collapseEmptyDivs();
            googletag.pubads().disableInitialLoad();
            googletag.enableServices();
          });
          googletag.cmd.push(function () {
            googletag.display(slotDiv);
          });
          setAdStatus('close');
        }
      } else if (adsStatus === 'restart') {
        if (document.querySelector('.ads_wrapper')) {
          if (document.querySelector('.adsContainer').style.display != 'none') {
            //const adsIFrame = document.getElementById(slotDiv).children[0].children[0];
            //const adsImage = adsIFrame.contentWindow.document.querySelector('amp-img');
            if (windowWidth >= (maxWidth + 12)) {
              /* adsIFrame.width = maxWidth;
              adsIFrame.height = maxHeight;

              adsImage.style.width = maxWidth + 'px';
              adsImage.style.height = maxHeight + 'px'; */

              if (prevWidth != windowWidth) {
                setPrevWidth(windowWidth);
                googletag.pubads().refresh();
                document.querySelector('.ads_wrapper').classList.add('adsBigBox');
              }
            } else {
              /* adsIFrame.width = minWidth;
              adsIFrame.height = minHeight;

              adsImage.style.width = minWidth + 'px';
              adsImage.style.height = minHeight + 'px'; */
              
              if (prevWidth != windowWidth) {
                setPrevWidth(windowWidth);
                googletag.pubads().refresh();
                document.querySelector('.ads_wrapper').classList.remove('adsBigBox');
              }
            }
          }
        }
        if (document.querySelector('.ads_wrapper').style.display === 'block') {
          setAdStatus('idle');
        } else {
          setAdStatus('close');
        }
      } else if (adsStatus === 'idle') {
        clearTimeout(pubAdsRefreshInterval.timeObject);

        if (document.querySelector('.ads_wrapper')) {
          let delay = 15000;
          if (pubAdsRefreshInterval.timeStart > 0) {
            delay = delay - (new Date().getTime() - pubAdsRefreshInterval.timeStart);
          } else {
            pubAdsRefreshInterval.timeStart = new Date().getTime();
          }

          pubAdsRefreshInterval.timeObject = setTimeout(() => {
            pubAdsRefreshInterval.timeStart = 0;
            setAdStatus('close');
          }, delay);
        }
      } else if (adsStatus === 'close') {
        clearTimeout(pubAdsRefreshInterval.timeObject);

        if (document.querySelector('.ads_wrapper')) {
          while(document.querySelector('.adsURLLink')) {
            document.querySelector('.adsURLLink')?.remove();
          }

          let delay = intervalTime;
          if (pubAdsRefreshInterval.timeStart > 0) {
            delay = delay - (new Date().getTime() - pubAdsRefreshInterval.timeStart);
          } else {
            pubAdsRefreshInterval.timeStart = new Date().getTime();
          }

          if (document.querySelector('.ads_wrapper')) {
            document.querySelector('.ads_wrapper').style.display = 'none';
          }

          pubAdsRefreshInterval.timeObject = setTimeout(() => {
            if (refreshCounter === 0) {
              googletag.pubads().refresh();
              refreshCounter = 1
            } else {
              refreshCounter = 0
            }
            console.log('CALL CALL')
            setTimeout(() => {
              if (document.querySelector('.ads_wrapper')) {
                if (document.querySelector('.adsContainer').style.display != 'none') {
                  const adsIFrame = document.getElementById(slotDiv)?.children[0]?.children[0];

                  if (adsIFrame == null || adsIFrame == undefined) {
                    //document.querySelector('.adsContainer').style.display = 'none';
                    pubAdsRefreshInterval.timeStart = 0;
                    setAdStatus('close');
                  } else {
                    //const adsImage = adsIFrame.contentWindow.document.querySelector('amp-img');

                    if (document.querySelector('.adsURLLink') == null || document.querySelector('.adsURLLink') == undefined) {
                      const adsLink = adsIFrame.contentWindow.document.querySelector('a')?.href;
                      const adsOverlayBoxLink = document.createElement('div');
                      adsOverlayBoxLink.classList.add('adsURLLink');
                      adsOverlayBoxLink.style.width = '100%';
                      adsOverlayBoxLink.style.height = '100%';
                      adsOverlayBoxLink.style.top = '0';
                      adsOverlayBoxLink.style.position = 'absolute';


                      document.querySelector('.adsStyling')?.appendChild(adsOverlayBoxLink);
                      const elementAds = document.querySelector('.adsURLLink')
                      if (elementAds) {
                        elementAds.addEventListener('click', function(e) {
                          e.preventDefault();
                          e.stopPropagation();

                          window.open(adsLink, '_blank');
                        });
                      }
                    }

                    if (windowWidth >= (maxWidth + 12)) {
                      /* adsIFrame.width = maxWidth;
                      adsIFrame.height = maxHeight;

                      adsImage.style.width = maxWidth + 'px';
                      adsImage.style.height = maxHeight + 'px'; */

                      document.querySelector('.ads_wrapper').classList.add('adsBigBox');
                    } else {
                      /* adsIFrame.width = minWidth;
                      adsIFrame.height = minHeight;

                      adsImage.style.width = minWidth + 'px';
                      adsImage.style.height = minHeight + 'px'; */

                      document.querySelector('.ads_wrapper').classList.remove('adsBigBox');
                    }

                    document.querySelector('.ads_wrapper').style.display = 'block';

                    pubAdsRefreshInterval.timeStart = 0;
                    setAdStatus('idle');
                  }
                }
              }
            }, 1000);
          }, delay - 1000);
        }
      }
    }
    return () => clearTimeout(pubAdsRefreshInterval.timeObject);
  }, [adsStatus]);

  // fullscreen
  useEffect(() => {
    if (player !== null) {
      if ((props.type === 'live tv' || props.type === 'live event') && ((props.data && props.data.gpt && props.data.gpt.path != null) &&  (props.data && props.data.gpt && props.data.gpt.path != undefined))) {
        document.querySelector('.ads_wrapper').classList.toggle('fullscreen-player', playerFullscreen);
        setAdStatus('restart');
      }
    }
  }, [playerFullscreen]);

  return (
    // <div className="rplus-jw-container" style={{backgroundImage: "url('../../../static/placeholders/placeholder_landscape.png')"}}>
    <div className="rplus-jw-container">
      { getPlayer(status.isError01 , status.isError02 ) }
      {/* <div id="jwplayer-rctiplus" ref={ playerRef } /> */}
    </div>
  );
};

export default JwPlayer;

const getPlayer = (error1, error2) => {
  if (error1) {
    console.log('GEO')
    return error(msgError01)
  }
  if (error2) {
    console.log('ERRORRRRR P')
    return error()
  }
  return (<div id="jwplayer-rctiplus" />)
}

JwPlayer.propTypes = {
  data: PropTypes.object,
  isLive: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  type: PropTypes.string,
  customData: PropTypes.object,
  onResume: PropTypes.func,
  isResume: PropTypes.bool,
  statusError: PropTypes.number,
};

JwPlayer.defaultProps = {
  data: {
    content_type: 'N/A',
    content_id: 'N/A',
    program_name: 'N/A',
    program_id: 'N/A',
    content_name: 'N/A',
    url: '',
    vmap: '',
  },
  isLive: false,
  isFullscreen: false,
  type: '',
  customData: {
    program_name: '',
  },
  onResume: () => {},
  isResume: false,
  geoblockStatus: false,
  statusError: 0,
};

const foward10 = `
<svg class="icon-forward" xmlns="http://www.w3.org/2000/svg" width="46" height="15" viewBox="0 0 46 15">
<g fill="none" fill-rule="evenodd">
    <path fill="#FFF" fill-rule="nonzero" d="M6 21l11.171-7.5L6 6v15zM17.829 6v15L29 13.5 17.829 6z" transform="translate(-6 -6)"/>
    <path d="M0 0L31 0 31 29 0 29z" transform="translate(-6 -6)"/>
    <path d="M0 0L31 0 31 29 0 29z" transform="translate(-6 -6)"/>
    <g>
        <path fill="#FFF" fill-rule="nonzero" d="M6 21l11.171-7.5L6 6v15zM17.829 6v15L29 13.5 17.829 6z" transform="translate(-6 -6) translate(23)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-6 -6) translate(23)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-6 -6) translate(23)"/>
    </g>
</g>
</svg>`;

const backward10 = `
<svg xmlns="http://www.w3.org/2000/svg" width="46" height="15" viewBox="0 0 46 15">
<g fill="none" fill-rule="evenodd">
    <g>
        <path fill="#FFF" fill-rule="nonzero" d="M6 21l11.171-7.5L6 6v15zM17.829 6v15L29 13.5 17.829 6z" transform="translate(-2 -6) matrix(-1 0 0 1 31 0)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-2 -6) matrix(-1 0 0 1 31 0)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-2 -6) matrix(-1 0 0 1 31 0)"/>
    </g>
    <g>
        <path fill="#FFF" fill-rule="nonzero" d="M6 21l11.171-7.5L6 6v15zM17.829 6v15L29 13.5 17.829 6z" transform="translate(-2 -6) matrix(-1 0 0 1 54 0)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-2 -6) matrix(-1 0 0 1 54 0)"/>
        <path d="M0 0L31 0 31 29 0 29z" transform="translate(-2 -6) matrix(-1 0 0 1 54 0)"/>
    </g>
</g>
</svg>
`;
const foward10Icon = `
<svg width="48px" height="48px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 52.6 (67491) - http://www.bohemiancoding.com/sketch -->
    <title>fastforward</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <polygon id="path-1" points="48 48 0 48 0 0 48 0"></polygon>
    </defs>
    <g id="fastforward" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="baseline-forward_10-24px-(1)">
            <g id="Clipped">
                <mask id="mask-2" fill="white">
                    <use xlink:href="#path-1"></use>
                </mask>
                <g id="a"></g>
                <path d="M8,26 C8,34.8 15.2,42 24,42 C32.8,42 40,34.8 40,26 L36,26 C36,32.6 30.6,38 24,38 C17.4,38 12,32.6 12,26 C12,19.4 17.4,14 24,14 L24,22 L34,12 L24,2 L24,10 C15.2,10 8,17.2 8,26 L8,26 Z M21.6,32 L20,32 L20,25.4 L18,26 L18,24.6 L21.6,23.4 L21.8,23.4 L21.8,32 L21.6,32 Z M30.2,28.4 C30.2,29 30.2,29.6 30,30 L29.4,31.2 C29.4,31.2 28.8,31.8 28.4,31.8 C28,31.8 27.6,32 27.2,32 C26.8,32 26.4,32 26,31.8 C25.6,31.6 25.4,31.4 25,31.2 C24.6,31 24.6,30.6 24.4,30 C24.2,29.4 24.2,29 24.2,28.4 L24.2,27 C24.2,26.4 24.2,25.8 24.4,25.4 L25,24.2 C25,24.2 25.6,23.6 26,23.6 C26.4,23.6 26.8,23.4 27.2,23.4 C27.6,23.4 28,23.4 28.4,23.6 C28.8,23.8 29,24 29.4,24.2 C29.8,24.4 29.8,24.8 30,25.4 C30.2,26 30.2,26.4 30.2,27 L30.2,28.4 L30.2,28.4 Z M28.6,26.8 L28.6,25.8 C28.6,25.8 28.4,25.4 28.4,25.2 C28.4,25 28.2,25 28,24.8 C27.8,24.6 27.6,24.6 27.4,24.6 C27.2,24.6 27,24.6 26.8,24.8 L26.4,25.2 C26.4,25.2 26.2,25.6 26.2,25.8 L26.2,29.8 C26.2,29.8 26.4,30.2 26.4,30.4 C26.4,30.6 26.6,30.6 26.8,30.8 C27,31 27.2,31 27.4,31 C27.6,31 27.8,31 28,30.8 L28.4,30.4 C28.4,30.4 28.6,30 28.6,29.8 L28.6,26.8 L28.6,26.8 Z" id="Shape" fill="#FFFFFF" mask="url(#mask-2)"></path>
            </g>
        </g>
    </g>
</svg>`;

const backward10Icon = `
<svg width="48px" height="48px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 52.6 (67491) - http://www.bohemiancoding.com/sketch -->
    <title>previous</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <polygon id="path-1" points="48 48 0 48 0 0 48 0"></polygon>
    </defs>
    <g id="previous" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="baseline-forward_10-24px-(1)">
            <g id="Clipped">
                <mask id="mask-2" fill="white">
                    <use xlink:href="#path-1"></use>
                </mask>
                <g id="a"></g>
                <path d="M40,26 C40,34.8 32.8,42 24,42 C15.2,42 8,34.8 8,26 L12,26 C12,32.6 17.4,38 24,38 C30.6,38 36,32.6 36,26 C36,19.4 30.6,14 24,14 L24,22 L14,12 L24,2 L24,10 C32.8,10 40,17.2 40,26 L40,26 Z M21.6,32 L20,32 L20,25.4 L18,26 L18,24.6 L21.6,23.4 L21.8,23.4 L21.8,32 L21.6,32 Z M30.2,28.4 C30.2,29 30.2,29.6 30,30 L29.4,31.2 C29.4,31.2 28.8,31.8 28.4,31.8 C28,31.8 27.6,32 27.2,32 C26.8,32 26.4,32 26,31.8 C25.6,31.6 25.4,31.4 25,31.2 C24.6,31 24.6,30.6 24.4,30 C24.2,29.4 24.2,29 24.2,28.4 L24.2,27 C24.2,26.4 24.2,25.8 24.4,25.4 L25,24.2 C25,24.2 25.6,23.6 26,23.6 C26.4,23.6 26.8,23.4 27.2,23.4 C27.6,23.4 28,23.4 28.4,23.6 C28.8,23.8 29,24 29.4,24.2 C29.8,24.4 29.8,24.8 30,25.4 C30.2,26 30.2,26.4 30.2,27 L30.2,28.4 L30.2,28.4 Z M28.6,26.8 L28.6,25.8 C28.6,25.8 28.4,25.4 28.4,25.2 C28.4,25 28.2,25 28,24.8 C27.8,24.6 27.6,24.6 27.4,24.6 C27.2,24.6 27,24.6 26.8,24.8 L26.4,25.2 C26.4,25.2 26.2,25.6 26.2,25.8 L26.2,29.8 C26.2,29.8 26.4,30.2 26.4,30.4 C26.4,30.6 26.6,30.6 26.8,30.8 C27,31 27.2,31 27.4,31 C27.6,31 27.8,31 28,30.8 L28.4,30.4 C28.4,30.4 28.6,30 28.6,29.8 L28.6,26.8 L28.6,26.8 Z" id="Shape" fill="#FFFFFF" mask="url(#mask-2)"></path>
            </g>
        </g>
    </g>
</svg>
`;

const closeIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <g fill="none" fill-rule="evenodd">
          <circle cx="10" cy="10" r="10" fill="#000" fill-opacity=".8"/>
          <path fill="#FFF" fill-rule="nonzero" d="M15 6.007L13.993 5 10 8.993 6.007 5 5 6.007 8.993 10 5 13.993 6.007 15 10 11.007 13.993 15 15 13.993 11.007 10z"/>
      </g>
  </svg>
`

const tempId = (value) => {
  if (value === 'rcti' || value === 1) {
    return ['1', 'RCTI'];
  }
  if (value === 'mnctv' || value === 2) {
    return ['2', 'MNCTV'];
  }
  if (value === 'gtv' || value === 3) {
    return ['3', 'GTV'];
  }
  if (value === 'inews' || value === 4) {
    return ['4', 'INEWS'];
  }
  return ['N/A', 'N/A'];
};

const getLive = (value) => {
  if(value === 'live tv' || value === 'live event') {
    return true;
  }
  return false;
}

const error = (msg = msgError02, icon = (<Wrench />)) => {
  return (
    <div id="jwplayer-rctiplus" style={{
      textAlign: 'center',
      padding: 30,
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      { icon }
      <h5 style={{ color: '#8f8f8f' }}>
        { msg() }
      </h5>
    </div>
  );
};

const msgError01 = () => {
  return(
    <div>
      <strong style={{ fontSize: 14 }}>Whoops, Your Location doesnt support us to live stream this content</strong><br />
    </div>
  )
}
const msgError02 = () => {
  return(
    <div>
      <strong style={{ fontSize: 14 }}>Video Errror</strong><br />
      <span style={{ fontSize: 12 }}>Sorry, Error has occurred,</span><br />
      <span style={{ fontSize: 12 }}>Please try again later.</span>
    </div>
  )
}
