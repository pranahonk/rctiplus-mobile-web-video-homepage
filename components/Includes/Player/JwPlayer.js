import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { convivaJwPlayer} from '../../../utils/conviva';
import { getUserId } from '../../../utils/appier';
import { onTrackingClick } from '../program-detail/programDetail';
import { isIOS } from 'react-device-detect';
import Wrench from '../Common/Wrench';
import '../../../assets/scss/jwplayer.scss';

const JwPlayer = (props) => {
  const [player, setPlayer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isCustomSetup, setIsCustomSetup] = useState(0);
  const [isConviva, setIsConviva] = useState(0);
  const [geoblock, setGeoblock] = useState();
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
    console.log('EFFECT INIT 1', props);
    if (props.geoblockStatus) {
      setStatus({
        isPlayer: false,
        isError01: true,
      });
    }
    setPlayer(jwplayer);
    if (props.data && props.data.url) {
      setIsConviva(Math.random());
      setIsCustomSetup(Math.random());
      jwplayer.setup(options);
    }
    return () => {
      if (player !== null) {
        console.log('DISPOSEEEEEE');
        jwplayer.remove();
      }
    };
  }, []);

  // Update Setup
  useEffect(() => {

    console.log('EFFECT INIT 2');
    if (player !== null) {
      setIsConviva(Math.random());
      setIsCustomSetup(Math.random());
      player.setup(options);
    }
  }, [props.data && props.data.url, props.data && props.data.vmap]);

  // Costum Setup
  useEffect(() => {
    console.log('EFFECT INIT 3');
    console.log('PLAYER GET DATA: ',props, player);
    if (player !== null) {
      player.on('ready', (event) => {
        if (props.isFullscreen) {player.setFullscreen(true);}
        const playerContainer = player.getContainer();
        const fowardContainer = playerContainer.querySelector('.jw-icon-next');
        const backwardContainer = playerContainer.querySelector('.jw-icon-rewind');
        const isLiveContainer = playerContainer.querySelector('.jw-dvr-live');

        const forwardElement = document.createElement('div');
        forwardElement.classList.add('jw-rplus-forward');
        forwardElement.innerHTML = foward10;
        // const iconForward = document.querySelector('.icon-forward');
        forwardElement.addEventListener('dblclick', (ev) => {
          console.log('TOUCH:', ev);
          // iconForward.classList.add('animated', 'fadeInRight', 'go');
          setTimeout(() => {
            // iconForward.classList.remove('animated', 'fadeInRight', 'go');
            forwardElement.style.opacity = 0;
          }, 900);
        });
        playerContainer.append(forwardElement);
        console.log('LIVEEE', isLiveContainer);
        if (props.type !== 'live tv' || props.type !== 'live event') {
          fowardContainer.innerHTML = foward10;
          backwardContainer.innerHTML = backward10;
          fowardContainer.addEventListener('touchstart', () => {
            player.seek(player.getPosition() + 10);
          });
        }
        if (props.type === 'live tv' || props.type === 'live event') {
          console.log(fowardContainer);
          fowardContainer.innerHTML = '';
          backwardContainer.innerHTML = '';
        }
        if (isIOS) {
          const elementCreateMute = document.createElement('btn');
          const elementMuteIcon = document.createElement('span');
          elementCreateMute.classList.add('jwplayer-vol-off');
          elementCreateMute.innerText = 'Tap to unmute ';

          player.setMute(true);
          playerContainer.appendChild(elementCreateMute);
          elementCreateMute.appendChild(elementMuteIcon);
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
        console.log('PLAYING');
        convivaJwPlayer().playing();
      });
      player.on('pause', () =>{
        console.log('PAUSE');
        convivaJwPlayer().pause();
      });
      player.on('buffer', (event) =>{
        console.log('BUFFER', event);
        convivaJwPlayer().buffer();
      });
      player.on('adError', (event) => {
        console.log('ERRRRRORRR', event);
      });
      player.on('time', (event) => {
        // console.log('duration:', event.currentTime);
        setDuration(player.getPosition());
      });
    }
  }, [isCustomSetup]);


  useEffect(() => {
    const containerElement = document.getElementsByClassName('rplus-jw-container');
    if (player !== null) {
      player.on('error', (event) => {
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        player.remove();
        if (props.data.url === 'error') {
          setStatus({
            isPlayer: false,
            isError01: true,
          });
          return false;
        }
        setStatus({
          isPlayer: false,
          isError01: false,
          isError02: true,
        });
      });
      player.on('setupError', (event) => {
        console.log('PLAYER SETUP ERROR', event);
        const convivaTracker = convivaJwPlayer();
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        player.remove();
        if (props.data.url === 'error') {
          setStatus({
            isPlayer: false,
            isError01: true,
          });
          return false;
        }
        setStatus({
          isPlayer: false,
          isError01: false,
          isError02: true,
        });
      });
    }
  });
  // Continue Watching

  useEffect(() => {
    console.log('EFFECT INIT 4', duration);
    // val.current = props;
    return () => {
      if (window.convivaVideoAnalytics) {
        const convivaTracker = convivaJwPlayer();
        convivaTracker.cleanUpSession();
        console.log('RELESE FROM');
      }

      if (props.isResume && (props.data && props.data.id)) {
        console.log('DURATION :', duration);
        props.onResume(props.data.id, props.data.content_type, duration);
      }
    };
  }, [props.data && props.data.url]);

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
      console.log('EFFECT INIT 5');
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
        assetName : props.type === 'live tv' || props.type === 'live event' || props.type === 'missed event' ?
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
                    tempId(props.data.channel)[0] : 'N/A',
        tv_name: props.type === 'live tv' ?
                    props.data && props.data.assets_name :
                    props.type === 'catch up tv' ?
                    tempId(props.data.channel)[0] :
                    'N/A',
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
        viewer_id: getUserId().toString(),
        application_name: 'RCTI+ MWEB',
        section_page: 'N/A',
        genre: genreTags,
      };
      if (player !== null) {
        console.log('CONVIVA TAGS: ',optionsConviva);
        const convivaTracker = convivaJwPlayer(optionsConviva.assetName, player, player.getDuration(), props.data.url ? props.data.url : props.data.trailer_url, customTags);
        if (window.convivaVideoAnalytics) {
          convivaTracker.cleanUpSession();
        }
        convivaTracker.createSession();
      }
      console.log('CONVIVA PLAYER', window.convivaVideoAnalytics);
    }
  }, [isConviva]);


  return (
    <div className="rplus-jw-container" style={{backgroundImage: "url('../../../static/placeholders/placeholder_landscape.png')"}}>
      {
        status.isPlayer ? (<div id="jwplayer-rctiplus" ref={ playerRef } />) :
        status.isError01 ?  error(msgError01) : 
        status.isError02 ?  error() :
        (<div/>)
      }
      {/* <div id="jwplayer-rctiplus" ref={ playerRef } /> */}
    </div>
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

const tempId = (value) => {
  if (value === 'rcti') {
    return ['1', 'RCTI'];
  }
  if (value === 'mnctv') {
    return ['2', 'MNCTV'];
  }
  if (value === 'gtv') {
    return ['3', 'GTV'];
  }
  if (value === 'inews') {
    return ['4', 'INEWS'];
  }
  return ['N/A', 'N/A'];
};

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
