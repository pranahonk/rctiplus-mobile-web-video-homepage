import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isIOS } from 'react-device-detect';

import { convivaJwPlayer} from '../../../utils/conviva';
import Wrench from '../Common/Wrench';
import '../../../assets/scss/jwplayer.scss';

import useCustomPlayerButton from "../../hooks/Jwplayer/useCustomPlayerButton"
import useSetupBitrate from "../../hooks/Jwplayer/useSetupBitrate"
import useConvivaInitiator from "../../hooks/Jwplayer/useConvivaInitiator"

const pubAdsRefreshInterval = {
  timeObject: null,
  timeStart: 0,
};

let refreshCounter = 0;

const JwPlayer = (props) => {
  const [player, setPlayer] = useState(null);
  const [ currentContent, setCurrentContent ] = useState({})
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

  // Custom Hooks
  const { setIsPlayerReady, setHideBtns } = useCustomPlayerButton({ ...props, player })
  const [ setBitrateLevels ] = useSetupBitrate({ ...props, player })
  const { setInitConviva } = useConvivaInitiator({ ...props, player })

  // Supporting Variables
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
  
  // player initial setup
  useEffect(() => {
    const jwplayer = window.jwplayer(idPlayer);
    if (props.geoblockStatus) {
      setStatus({
        isPlayer: false,
        isError01: true,
      });
    }
    setPlayer(jwplayer);
    if (props.data && props.data.url) {
      setCurrentContent(props.data)
      jwplayer.setup(options);
    }

    // shall trigger only when content is not changed on player but immediately destroyed
    jwplayer.on("remove", _ => {
      if (!props.isResume || !props.data.id) return
      props.onResume(props.data.id, props.data.content_type, jwplayer.getPosition());
    })

    return () => {
      jwplayer.remove();
    };
  }, []);

  // listen data update on player
  useEffect(() => {
    if (player !== null) {

      // Continue watching when changing between video contents
      if (props.customData && props.customData.isLogin && props.isResume && (currentContent.id)) {
        props.onResume(currentContent.id, currentContent.content_type, player.getPosition());
      }
      
      player.setup(options);
      setIsPlayerReady(false)
      setCurrentContent(props.data)

      // shall trigger when there are content change on player before being destroyed
      player.on("remove", _ => {
        if (!props.isResume || !props.data.id) return
        props.onResume(props.data.id, props.data.content_type, player.getPosition());
      })
    }
  }, [props.data && props.data.url]);

  // Costum Setup
  useEffect(() => {
    if (player !== null) {
      player.on('ready', (event) => {
        setPlayerFullscreen(props.isFullscreen);
        setIsPlayerReady(true)

        const playerContainer = player.getContainer()
        const isLiveContainer = playerContainer.querySelector('.jw-dvr-live');
        const isForward = playerContainer.querySelector('.jw-rplus-forward');

        if (props.type.includes("live")) {
          const data = props.data
          // check if gpt data exist
          if ((data && data.gpt && data.gpt.path != null) && (data && data.gpt && data.gpt.path != undefined)) {
            // check if ads_wrapper element not exist
            if (document.querySelector('.ads_wrapper') == undefined) {
              const adsOverlayElement = document.createElement('div');
              adsOverlayElement.classList.add('ads_wrapper');
              adsOverlayElement.style.display = 'none';
    
              const adsOverlayBox = document.createElement('div');
              adsOverlayBox.classList.add('adsStyling');
    
              const adsOverlayCloseButton = document.createElement('div');
              adsOverlayCloseButton.classList.add('close_button');
              adsOverlayCloseButton.innerHTML = closeIcon;
    
              const adsOverlayContainer = document.createElement('div');
              const divGPTString = (data && data.gpt && data.gpt.div_gpt != null) && (data && data.gpt && data.gpt.div_gpt != undefined) ? data.gpt.div_gpt : type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV_DIV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV;
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

        if(isForward) {
          const forwardElement = document.createElement('div');
          forwardElement.classList.add('jw-rplus-forward');
          forwardElement.innerHTML = foward10;
          forwardElement.addEventListener('dblclick', (ev) => {
            setTimeout(() => {
              forwardElement.style.opacity = 0;
            }, 900);
          });
          playerContainer.append(forwardElement);
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
      })

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
      })

      player.on('play', () => {
        setBitrateLevels(player.getQualityLevels())
        setInitConviva(true)

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
      })
      
      player.on('pause', () =>{
        convivaJwPlayer().pause();
      });

      player.on('buffer', (event) =>{
        convivaJwPlayer().buffer();
      });

      player.on('adError', (event) => {
      });

      player.on('complete', (event) => {
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
      });

      player.on('fullscreen', (event) => {
        setPlayerFullscreen(player.getFullscreen());
      });

      // ads event
      player.on('adImpression', (event) => {
        if (document.querySelector('.ads_wrapper')) {
          setAdStatus('none');
        }
      });

      player.on("adPlay", _ => {
        setHideBtns(true)
      })
      
      player.on('adSkipped', (event) => {
        setHideBtns(false)
        
        if (document.querySelector('.ads_wrapper')) {
          if (adsStatus === 'none') {
            setAdStatus('prestart');
          }
        }
      });
      
      player.on('adComplete', (event) => {
        setHideBtns(false)
        
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
    }
  });

  useEffect(() => {
    const containerElement = document.getElementsByClassName('rplus-jw-container');
    if (player !== null) {
      player.on('error', (event) => {
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
      player.on('setupError', (event) => {
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

  // conviva tracker cleanup function
  useEffect(() => {
    return () => {
      if (window.convivaVideoAnalytics) {
        const convivaTracker = convivaJwPlayer();
        convivaTracker.cleanUpSession();
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

  // ads overlay
  useEffect(() => {
    if (player !== null) {
      // let windowWidth = document.documentElement.clientWidth;
      let slotName = props.data.gpt?.path != null && props.data.gpt?.path != undefined ? props.data.gpt?.path : props.type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT;
      let slotDiv = props.data.gpt?.div_gpt != null && props.data.gpt?.div_gpt != undefined ? props.data.gpt?.div_gpt : props.type === 'live tv' ? process.env.GPT_MOBILE_OVERLAY_LIVE_TV_DIV : process.env.GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV;
      let intervalTime = props.data.gpt?.interval_gpt != null && props.data.gpt?.interval_gpt != undefined ? props.data.gpt?.interval_gpt : props.adsOverlayData?.reloadDuration;
      let minWidth = props.data.gpt?.size_width_1 != null && props.data.gpt?.size_width_1 != undefined ? props.data.gpt?.size_width_1 : 320;
      let maxWidth = props.data.gpt?.size_width_2 != null && props.data.gpt?.size_width_2 != undefined ? props.data.gpt?.size_width_2 : 468;
      let minHeight = props.data.gpt?.size_height_1 != null && props.data.gpt?.size_height_1 != undefined ? props.data.gpt?.size_height_1 : 50;
      let maxHeight = props.data.gpt?.size_height_2 != null && props.data.gpt?.size_height_2 != undefined ? props.data.gpt?.size_height_2 : 60;
      let custParams = props.data.gpt?.cust_params != null && props.data.gpt?.cust_params != undefined ? props.data.gpt?.cust_params : null;

      if (adsStatus === 'start') {
        clearTimeout(pubAdsRefreshInterval.timeObject);

        if (document.querySelector('.ads_wrapper')) {
          googletag.destroySlots();
          window.googletag = window.googletag || { cmd: [] };
          googletag.cmd.push(function () {
            const mappingSlot = googletag.sizeMapping().addSize([(maxWidth + 15), maxHeight], [maxWidth, maxHeight]).addSize([0, 0], [minWidth, minHeight]).build();

            googletag.defineSlot(slotName, [[maxWidth, maxHeight], [minWidth, minHeight]], slotDiv)
            .defineSizeMapping(mappingSlot)
            .addService(googletag.pubads());

            // TODO: looping targeting value
            if (custParams != null) {
              for (const custParam of custParams) {
                googletag.pubads().setTargeting(custParam.name, custParam.value);
              }
            }

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
            const adsIFrame = document.getElementById(slotDiv)?.children[0]?.children[0];
            if (adsIFrame) {
              setTimeout(() => {
                if (document.querySelector('.fullscreen-player')) {
                  if (adsIFrame.width != maxWidth) {
                    googletag.pubads().refresh();
                  }
                } else {
                  if (adsIFrame.width != minWidth) {
                    googletag.pubads().refresh();
                  }
                }
              }, 100);
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
      if (["start", "prestart"].includes(adsStatus)) {
        const adsWrapper = document.querySelector('.ads_wrapper') || {}
        intervalAds = setInterval(() => {
          changeScreen()
          googletag.pubads().refresh();
          timeoutAds = setTimeout(() => {
            adsWrapper.style.display = "none"
          }, 10000)
        }, intervalTime)
      }

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

                    document.querySelector('.ads_wrapper').style.display = 'block';

                    pubAdsRefreshInterval.timeStart = 0;
                    setAdStatus('idle');
                  }
                }
              }
            }, 1000);
          }, delay - 1000);
        }
      function changeScreen() {
        const adsWrapper = document.querySelector('.ads_wrapper')
        if (screen.orientation.type === "portrait-primary") {
          handleAds(slotName, slotDiv, custParams, adSizePotrait)
        }
        if (screen.orientation.type === "landscape-primary") {
          handleAds(slotName, slotDiv, custParams, adSizeLandscape)
        }
        if (adsWrapper) adsWrapper.style.display = "block"
        googletag.pubads().refresh();
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

  const getPlayer = (error1, error2) => {
    if (error1) {
      return error(msgError01)
    }
    if (error2) {
      return error()
    }
    return (
      <>
        <div id="jwplayer-rctiplus" />
      </>
    )
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
        <strong style={{ fontSize: 14 }}>Cannot load the video</strong><br />
        <span style={{ fontSize: 12 }}>Please try again later,</span><br />
        <span style={{ fontSize: 12 }}>we are working to fix the problem</span>
      </div>
    )
  }

  return (
    <>
      <div className="rplus-jw-container" style={{position: "relative"}}>
        { getPlayer(status.isError01 , status.isError02 ) }
      </div>
    </>
  );
};

export default JwPlayer;

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

const closeIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <g fill="none" fill-rule="evenodd">
          <circle cx="10" cy="10" r="10" fill="#000" fill-opacity=".8"/>
          <path fill="#FFF" fill-rule="nonzero" d="M15 6.007L13.993 5 10 8.993 6.007 5 5 6.007 8.993 10 5 13.993 6.007 15 10 11.007 13.993 15 15 13.993 11.007 10z"/>
      </g>
  </svg>
`
