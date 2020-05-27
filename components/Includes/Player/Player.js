import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'videojs-seek-buttons';
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';
import TitleOverlay, { PlayToggleCustom, MuteToggleCustom } from '../../../assets/js/videojs-plugin/videojs-custom-overlay';
import 'video.js/dist/video-js.css';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';


const Player = forwardRef((props, ref) => {
  const url = 'https://vcdn.rctiplus.id/vod/eds/jilbabinlove_aisyahputri_21/_/sa_hls/jilbabinlove_aisyahputri_21.m3u8';
  // const url = 'https://linier3.rctiplus.id/live/eds/RCTI_Logo/sa_hls/RCTI_Logo.m3u8?auth_key=1589835489-0-0-1016cbaa7b736ae7ebb8adf5f03d7191';
  const vmap = 'https://rc-static.rctiplus.id/vmap/vmap_ima_vod_episode_45_0_web_defaultvod.xml';
  const initRef = useRef(ref);
  const [videoPlayer, setVideoPlayer] = useState(null)
  const optionsPlayer = {
    autoplay: true,
    muted: true,
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
        overrideNative: !videojs.browser.IS_SAFARI,
        smoothQualityChange: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
  };
  const onAdEvent = useCallback((event) => {
    console.log('ADS: ' + event.type);
  },[]);
  useEffect(() => {
    console.log('MOUNTED_PLAYER', props.data);
    videojs.registerPlugin('hlsQualitySelector', qualitySelector);
    videojs.registerComponent('TitleBar', TitleOverlay);
    videojs.registerComponent('PlayToggleCustom', PlayToggleCustom);
    videojs.registerComponent('MuteToggleCustom', MuteToggleCustom);
    const player = videojs(initRef.current,optionsPlayer, () => {
    console.log('onPlayerReady',!videojs.browser.IS_SAFARI, player);
      player.src({
          src: props.data.url,
          type: 'application/x-mpegURL',
      });
      player.on('playing', function() {
        console.log('PLAYINGGGGGGGG')
      });
      player.on('ended', function() {
        console.log('ENDED');
      });
      player.on('error', function() {
        console.log('ERROR');
        player.errorDisplay.dispose();
      });
      player.seekButtons({
        forward: 10,
        back: 10,
      });
      player.hlsQualitySelector({
        displayCurrentQuality: false,
        vjsIconClass: 'vjs-icon-cog',
        identifyBy: 'bitrate',
      });
      player.qualityLevels().on('addqualitylevel', (event) => {
        const setQuality = event.qualityLevel;
        if (!setQuality.bitrate) {
          setQuality.width = 640;
          setQuality.height = 360;
        }
        console.log(setQuality);
      });
      player.removeChild('BigPlayButton');
      player.addChild('TitleBar', { text: 'TEST COMPONENT' });
      player.addChild('PlayToggleCustom');
      if (!videojs.browser.IS_SAFARI) {
        player.addChild('MuteToggleCustom');
      }
      const optionAds = {
        id: 'content_video',
        adTagUrl: props.data.vmap_ima,
        // autoPlayAdBreaks: false,
        adsManagerLoadedCallback: () => {
          const events = [
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK,
            google.ima.AdEvent.Type.COMPLETE,
            google.ima.AdEvent.Type.FIRST_QUARTILE,
            google.ima.AdEvent.Type.LOADED,
            google.ima.AdEvent.Type.MIDPOINT,
            google.ima.AdEvent.Type.PAUSED,
            google.ima.AdEvent.Type.RESUMED,
            google.ima.AdEvent.Type.STARTED,
            google.ima.AdEvent.Type.THIRD_QUARTILE,
          ];
          for (let index = 0; index < events.length; index++) {
            player.ima.addEventListener(
              events[index],
              (event) => {
                console.log('ADS LOGS: ' + event.type);
                if (event.type === 'complete') {
                  console.log('ADS COPLETE');
                  player.play();
                }
                if (event.type === 'loaded') {
                  // player.ima.playAdBreak();
                }
            }
            );
          }
          player.on('adslog', (data) => {
            console.log('VIDEOJS ADS LOG: ' + data.data.AdError);
          });
        },
      };
      player.ima(optionAds);
      player.ima.initializeAdDisplayContainer();
      player.ima.setAdBreakReadyListener(() => {
        videojs.log('ADS PLAYBREAK')
        player.ima.playAdBreak();
      })
    });
    setVideoPlayer(player)
    return () => {
      console.log('CLEANUP_PLAYER');
      if(videoPlayer !== null) {
        console.log('DISPOSEEEEEE')
        player.dispose();
      }
    };
  },[]);

  useEffect(() => {
    console.log('PLAYER_UPDATE', props.data);
    if(videoPlayer !== null) {
      videoPlayer.src({
        src: props.data.url,
        type: 'application/x-mpegURL',
    });
    }
  },[props.data])

  return (
    <>
      <div data-vjs-player>
        <video id="content_video" ref={ initRef } className="video-js vjs-default-skin vjs-big-play-centered vjs-rplus-player" playsInline />
      </div>
    </>
  );
});

export default Player;
