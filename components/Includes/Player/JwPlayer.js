import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isIOS } from 'react-device-detect';

import { convivaJwPlayer} from '../../../utils/conviva';
import Wrench from '../Common/Wrench';
import '../../../assets/scss/jwplayer.scss';

import useCustomPlayerButton from "../../hooks/Jwplayer/useCustomPlayerButton"
import useOverlayPlayerAds from "../../hooks/Jwplayer/useOverlayPlayerAds"
import useSetupBitrate from "../../hooks/Jwplayer/useSetupBitrate"
import useConvivaInitiator from "../../hooks/Jwplayer/useConvivaInitiator"

const pubAdsRefreshInterval = {
  timeObject: null,
  timeStart: 0,
};

let refreshCounter = 0;

const JwPlayer = (props) => {
  // Local States
  const [player, setPlayer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isCustomSetup, setIsCustomSetup] = useState(0);
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

  // Custom Hooks
  const [ setBitrateLevels ] = useSetupBitrate({ ...props, player })
  const { setInitConviva } = useConvivaInitiator({ ...props, player })
  const [ adsState, setAdsState, stateOfAds ] = useOverlayPlayerAds({ ...props, player })
  const { setIsPlayerReady, setHideBtns } = useCustomPlayerButton({ ...props, player })

  // Supporting Variables
  const idPlayer = 'jwplayer-rctiplus';
  const options = {
    autostart: true,
    mute: false,
    floating: false,
    // file: props.data && props.data.url,
    file: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
  
  // Initial Setup
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
      jwplayer.setup(options);
    }
    return () => {
      if (player !== null) {
        jwplayer.remove();
      }
    };
  }, []);

  // Update Setup
  useEffect(() => {
    if (player !== null) {
      setIsCustomSetup(Math.random());
      player.setup(options);

      setIsPlayerReady(false)
      setAdsState(stateOfAds.NONE)

      console.log(props.data.url)
    }
  }, [props.data && props.data.url, props.data && props.data.vmap]);

  // Costum Setup
  useEffect(() => {
    if (player !== null) {
      player.on('ready', (event) => {
        const playerContainer = player.getContainer();

        setAdsState(stateOfAds.INIT)
        setIsPlayerReady(true)

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
      
      player.on('play', () =>{
        setBitrateLevels(player.getQualityLevels())
        setInitConviva(true)

        convivaJwPlayer().playing();
        setAdsState(stateOfAds.START)
        setHideBtns(false)
      });

      player.on('pause', () =>{
        convivaJwPlayer().pause();
      });

      player.on('buffer', (event) =>{
        convivaJwPlayer().buffer();
      });
      
      player.on('adError', (event) => {
        setAdsState(stateOfAds.NONE)
      });
      
      player.on('time', (event) => {
        setDuration(player.getPosition());
      });
      
      player.on('complete', (event) => {
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
      });
      
      // ads event
      player.on('adImpression', (event) => {
        setAdsState(stateOfAds.NONE)
      });

      player.on("adPlay", _ => {
        setHideBtns(true)
      })
      
      player.on('adSkipped', (event) => {
        setAdsState(stateOfAds.START)
      });
      
      player.on('adComplete', (event) => {
        setAdsState(stateOfAds.START)
      });
      
      player.on('userActive', (event) => {
        if (document.querySelector('.jw-ads-overlay')) {
          document.querySelector('.jw-ads-overlay').style.bottom = '70px';
        }
      });
      
      player.on('userInactive', (event) => {
        if (document.querySelector('.jw-ads-overlay')) {
          document.querySelector('.jw-ads-overlay').style.bottom = '5px';
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

  // Continue Watching
  useEffect(() => {
    if(props.customData && props.customData.isLogin && props.isResume && (props.data && props.data.id)) {
      props.onResume(props.data.id, props.data.content_type, duration);
    }
  }, [isCustomSetup]);

  useEffect(() => {
    let ab = 0
    if(player !== null) {
      player.on('time', (event) => {
        ab = event.currentTime
      });
    }
    return () => {
      if (window.convivaVideoAnalytics) {
        const convivaTracker = convivaJwPlayer();
        convivaTracker.cleanUpSession();
      }

      if (props.isResume && (props.data && props.data.id)) {
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
