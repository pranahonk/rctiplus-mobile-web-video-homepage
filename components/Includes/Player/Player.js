import React, { useState } from 'react';
import videojs from 'video.js';


function Player(props) {
  const url = 'https://vcdn.rctiplus.id/vod/eds/1505_dai_l/_/sa_hls/1505_dai_l-avc1_31000=5.m3u8';
  const [init, setInit] = useState('testing');
  const [satu, dua] = [12, 13];
  return (
    <>
      <div>{ init }</div>
      <div>{ satu }</div>
      <div>{ dua }</div>
      <div onClick={ () => setInit('welcome to jungle') }> testting</div>
    </>
  );
}

export default Player;
