import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { convivaJwPlayer } from '../../../utils/conviva';
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
    advertising: {
      client: process.env.ADVERTISING_CLIENT,
      schedule: props.data.vmap,
    },
    logo: {
      hide: true,
    },
  };

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

  useEffect(() => {
    if (player !== null) {
      console.log('PLYARE', props.data.url);
      console.log('PLYARE', props.data.vmap);
      player.setup(options);
    }
  }, [props.data.url, props.data.vmap]);

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
      conviva.startMonitoring(player);
      const assetMetadata = {
        application_name: 'RCTI+ MWEB',
        asset_cdn: 'Conversant',
      };
      console.log('FIRST FRAME CONVIVA', assetMetadata);
      conviva.updatePlayerAssetMetadata(player, assetMetadata);
      // const convivaVideoAnalytics = Conviva.Analytics.buildVideoAnalytics();
      // convivaVideoAnalytics.setContentInfo(customTags)
      // const convivaTracker = convivaJwPlayer(props.data.content_name, player, player.getDuration(), props.data.url ? props.data.url : props.data.trailer_url, props.data.content_name, customTags);
      // convivaTracker.createSession();
        player.on('ready', () => {
        console.log('IS PLAYER DEVICE: ', player.getEnvironment().OS.android);
      });
      if (player.getEnvironment().OS.android) {
        player.setMute(false);
      }
    }
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
}

JwPlayer.defaultProps = {
  data: {
    content_type: 'N/A',
    content_id: 'N/A',
    program_name: 'N/A',
    program_id: 'N/A',
    content_name: 'N/A',
  },
}
