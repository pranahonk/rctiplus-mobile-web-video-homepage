import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';
import TitleOverlay from '../../../assets/js/videojs-plugin/videojs-custom-overlay';
import 'video.js/dist/video-js.css';
import '../../../assets/scss/components/program-detail.scss';


function Player(props) {
  // const url = 'https://pendidikan.rctiplus.id/hls/quran.m3u8';
  const url = 'https://linier3.rctiplus.id/live/eds/iNews_Logo/sa_hls/iNews_Logo.m3u8';
  // const url = 'https://pendidikan.rctiplus.id/hls/quran.m3u8';
  const initRef = useRef();
  const optionsPlayer = {
    autoplay: true,
    preload: 'auto',
    controls: true,
    aspectRatio: '16:9',
    fluid: true,
    disablePictureInPicture: true,
    controlBar: {
      'pictureInPictureToggle': false,
      'qualitySelector': true,
    },
    html5: {
      hls: {
        overrideNative: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
  };
  useEffect(() => {
    console.log('MOUNTED_PLAYER');
    // videojs.registerPlugin('hlsQualitySelector', qualitySelector);
    videojs.registerComponent('TitleBar', TitleOverlay);
    const player = videojs(initRef.current,optionsPlayer, () => {
    console.log('onPlayerReady', player);
    // console.log(player.qualityLevels());
      player.src({
          src: url,
          type: 'application/x-mpegURL',
      });
      player.on('playing', function() {
        console.log(player.qualityLevels());
        console.log('PLAYING');
      });
      player.on('ended', function() {
        console.log('ENDED');
      });
      player.on('error', function() {
        console.log('ERROR');
        player.errorDisplay.dispose();
      });
      player.hlsQualitySelector({
        displayCurrentQuality: false,
        vjsIconClass: 'vjs-icon-cog',
        identifyBy: 'bitrate',
      });
      player.qualityLevels().on('addqualitylevel', (event) => {
        const setQuality = event.qualityLevel;
        if(!setQuality.bitrate) {
          setQuality.width = 640;
          setQuality.height = 360;
        }
        console.log(setQuality)
      })
      player.addChild('TitleBar', { text: 'TEST COMPONENT' })
    });
    return () => {
      console.log('CLEANUP_PLAYER');
      player.dispose();
    };
  },[initRef]);

  return (
    <>
      <div data-vjs-player>
        <video ref={ initRef } className="video-js vjs-default-skin vjs-big-play-centered vjs-rplus-player" playsInline />
      </div>
    </>
  );
}

export default Player;

// class Player extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       left : 0,
//       init : 0,
//     };
//   }

//   componentDidMount() {
//     console.log('CLASS_MOUNTED');
//     document.title = `Klik ${this.state.init}`
//   }
//   componentDidUpdate() {
//     document.title = `Klik ${this.state.init}`
//   }
//   render() {
//     return(
//       <div style={{ color: 'white' }}>
//       <div>{ this.state.init }</div>
//         <div>{ console.log(this.state.left) }</div>
//         <div onClick={ () => this.setState({ init: this.state.init + 1 }) }>tessting</div>
//       </div>
//     )
//   }
// }

// export default Player;
