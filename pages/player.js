import React from 'react';
import JwPlayer from '../components/Includes/Player/JwPlayer';
import Layout from '../components/Layouts/Default';

class TestPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.player = null;
    this.state = {
      data: {
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        vmap: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator='
      },
    };
  }

  componentDidMount() {
    // this.initPlayer()
    // console.log(window.jwplayer('live-tv-player'))
  }
  render() {
    return(
      <Layout>
        <div>
          <JwPlayer data={this.state.data}/>
          <button onClick={ () => this.setState(
            { 
              data: {
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                vmap: 'https://rc-static.rctiplus.id/vmap/vmap_ima_vod_episode_45_0_web_defaultvod.xml',
                content_type: 'VOD',
                content_name: 'Aku Ganteng',
              },
            }) 
            }>KLIK</button>
        </div>
      </Layout>
    )
  }
}

export default TestPlayer;