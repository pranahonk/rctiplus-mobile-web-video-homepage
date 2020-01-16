import React from 'react'
import { connect } from 'react-redux';
import ReactJWPlayer from 'react-jw-player';
import initialize from '../utils/initialize';
import liveAndChatActions from '../redux/actions/liveAndChatActions';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavDefault from '../components/Includes/Navbar/NavDefault';

class Live extends React.Component {

    static getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
            live_events: [],
            selected_live_event: {},
            selected_live_event_url: {},
            meta: {}
        };
    }

    componentDidMount() {
        this.props.getLiveEvent('on air')
                .then(response => {
                    this.setState({live_events: response.data.data, meta: response.data.meta}, () => {
                        const liveEvents = this.state.live_events;
                        if (liveEvents.length > 0) {
                            this.props.getLiveEventUrl(liveEvents[0].id)
                                    .then(res => {
                                        this.setState({
                                            selected_live_event: liveEvents[0],
                                            selected_live_event_url: res.data.data
                                        });
                                    })
                                    .catch(error => console.log(error));

                        }
                    });
                })
                .catch(error => console.log(error));
    }

    render() {
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <ReactJWPlayer 
                        playerId={'live-tv-player'} 
                        isAutoPlay
                        onReady={() => {
                    }}
                        playerScript="https://cdn.jwplayer.com/libraries/Vp85L1U1.js"
                        file={this.state.selected_live_event_url ? this.state.selected_live_event_url.url : ''}/>
                    <div className="wrapper-content">
                
                    </div>
                </Layout>
                );
    }

}

export default connect(state => state, liveAndChatActions)(Live);
