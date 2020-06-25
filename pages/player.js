import React from 'react';
import JwPlayer from '../components/Includes/Player/JwPlayer';
import Layout from '../components/Layouts/Default_v2';
// url: 'https://linier3.rctiplus.id/live/eds/rcti_fta/live_fta/rcti_fta.m3u8?auth_key=1595523706-0-0-dd24dd0e1056870bafdd6b937c51e216',
class TestPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.player = null;
    this.state = {
      data: {
        url: 'https://vod.rctiplus.id/vod/104588/1/3/854/manifest.m3u8',
        // url: 'https://linier3.rctiplus.id/live/eds/rcti_fta/live_fta/rcti_fta.m3u8?auth_key=1595523706-0-0-dd24dd0e1056870bafdd6b937c51e216',
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
          <JwPlayer data={this.state.data} isLive={false}/>
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