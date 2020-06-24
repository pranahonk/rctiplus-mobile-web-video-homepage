import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { convivaJwPlayer} from '../../../utils/conviva';
import { getUserId } from '../../../utils/appier';
import { onTrackingClick } from '../program-detail/programDetail';
import '../../../assets/scss/jwplayer.scss';

const JwPlayer = (props) => {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef();
  const idPlayer = 'jwplayer-rctiplus';
  const options = {
    autostart: true,
    mute: true,
    floating: false,
    file: props.data.url,
    primary: 'html5',
    width: '100%',
    aspectratio: '16:9',
    displaytitle: true,
    setFullscreen: true,
    stretching: 'exactfit',
    // advertising: {
    //   client: process.env.ADVERTISING_CLIENT,
    //   schedule: props.data.vmap,
    // },
    skin: {
      name: 'rplus_player',
      url: '../../../assets/scss/jwplayer.scss',
    },
    logo: {
      hide: true,
    },
  };
  // Initial Setup
  useEffect(() => {
    const jwplayer = window.jwplayer(idPlayer);
    jwplayer.setup(options);
    setPlayer(jwplayer);
    return () => {
      console.log('PLAYER FILE :', props.file);
      if (player !== null) {
        console.log('DISPOSEEEEEE');
        jwplayer.remove();
      }
    };
  }, []);

  // Update Setup
  useEffect(() => {
    if (player !== null) {
      console.log('PLYARE', props.data.url);
      console.log('PLYARE', props.data.vmap);
      player.setup(options);
    }
  }, [props.data.url, props.data.vmap]);

  // Costum Setup
  useEffect(() => {
    if (player !== null) {
      player.on('ready', (event) => {
        const playerContainer = player.getContainer();
        const fowardContainer = playerContainer.querySelector('.jw-icon-next');
        const backwardContainer = playerContainer.querySelector('.jw-icon-rewind');
        const isLiveContainer = playerContainer.querySelector('.jw-dvr-live');
        console.log('LIVEEE', isLiveContainer)
        if(!props.isLive) {
          fowardContainer.innerHTML = foward10;
          backwardContainer.innerHTML = backward10;
          fowardContainer.addEventListener('touchstart', () => {
            player.seek(player.getPosition() + 10);
          });
        }
        if(props.isLive) {
          console.log('testtt')
          console.log(fowardContainer)
          fowardContainer.innerHTML = '';
          backwardContainer.innerHTML = '';
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
    }
  });

  // Conviva Tracker
  useEffect(() => {
    let genreTags = 'N/A';
    if (props.data.genre) {
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
    const assetName = props.data && props.data.content_name ? props.data.content_name : 'N/A';
    const customTags = {
      app_version: process.env.APP_VERSION,
      carrier: 'N/A',
      connection_type: 'N/A',
      content_type: (props.data.content_type ? props.data.content_type : 'N/A'),
      content_id: (props.data.id ? props.data.id : 'N/A').toString(),
      program_name: (props.data.program_title ? props.data.program_title : 'N/A'),
      tv_id: 'N/A',
      tv_name: 'N/A',
      date_video: 'N/A',
      page_title: 'N/A',
      page_view: 'N/A',
      program_id: (props.data.program_id ? props.data.program_id : 'N/A').toString(),
      screen_mode: 'portrait',
      time_video: 'N/A',
      viewer_id: getUserId().toString(),
      application_name: 'RCTI+ MWEB',
      section_page: 'N/A',
      genre: genreTags,
    };
    if (player !== null) {
      const convivaTracker = convivaJwPlayer(assetName, player, player.getDuration(), props.data.url ? props.data.url : props.data.trailer_url, customTags);
      if (window.convivaVideoAnalytics) {
        console.log('LOG CONVIVA');
        convivaTracker.cleanUpSession();
      }
      convivaTracker.createSession();
    }
    console.log('CONVIVA PLAYER', window.convivaVideoAnalytics);
  });


  return (
    <div className="rplus-jw-container" style={{backgroundImage: "url('../../../static/placeholders/placeholder_landscape.png')"}}>
      <div id="jwplayer-rctiplus" ref={ playerRef } />
    </div>
  );
};

export default JwPlayer;

JwPlayer.propTypes = {
  data: PropTypes.object,
  isLive: PropTypes.bool,
};

JwPlayer.defaultProps = {
  data: {
    content_type: 'N/A',
    content_id: 'N/A',
    program_name: 'N/A',
    program_id: 'N/A',
    content_name: 'N/A',
  },
  isLive: false,
};

const foward10 = `
<svg xmlns="http://www.w3.org/2000/svg" width="46" height="15" viewBox="0 0 46 15">
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
