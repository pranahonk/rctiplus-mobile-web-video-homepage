import React, { useEffect, useRef, useState } from 'react';
import { convivaVideoJs } from '../../../utils/conviva';
import { getUserId } from '../../../utils/appier';
import { onTrackingClick } from '../program-detail/programDetail';

const sampleFile = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const JwPlayer = (props) => {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef()
  const idPlayer = 'jwplayer-rctiplus'

  useEffect(() => {
    const jwplayer = window.jwplayer(idPlayer)
    jwplayer.setup({
			autostart: true,
			floating: false,
			file: sampleFile,
			primary: 'html5',
			width: '100%',
			aspectratio: '16:9',
			displaytitle: true,
			setFullscreen: true,
			stretching: 'exactfit',
			// advertising: {
			// 	client: process.env.ADVERTISING_CLIENT,
			// 	schedule: this.state.player_vmap,
			// },
			logo: {
				hide: true,
			},
    });
    
    setPlayer(jwplayer)

    return () => {
      console.log('CLEANUP_PLAYER');
      if (player !== null) {
        console.log('DISPOSEEEEEE');
        jwplayer.remove();
      }
    } 
  }, [])

  return(
    <>
      <div id="jwplayer-rctiplus" ref={ playerRef }></div>
    </>
  )
}

export default JwPlayer;
