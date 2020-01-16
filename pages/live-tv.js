import React from 'react'
import { connect } from 'react-redux';
import initialize from '../utils/initialize';
import liveAndChatActions from '../redux/actions/liveAndChatActions';

import Layout from '../components/Layouts/Default';
import SelectDateModal from '../components/Modals/SelectDateModal';

import { formatDate, formatDateWord, getFormattedDateBefore } from '../utils/dateHelpers';

import { Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import '../assets/scss/components/live-tv.scss';

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
            selected_index: 0,
            selected_tab: 'live',
            epg: [],
            meta: {},
            dates_before: getFormattedDateBefore(7),
            selected_date: formatDateWord(new Date('06 January 2020')),
            select_modal: false
        };

        this.player = null;
        this.currentDate = new Date('06 January 2020 11:39');
        this.props.setCatchupDate(formatDateWord(new Date('06 January 2020')));
    }

    componentDidMount() {
        this.props.getLiveEvent('on air')
                .then(response => {
                    this.setState({live_events: response.data.data, meta: response.data.meta}, () => {
                        if (this.state.live_events.length > 0) {
                            this.selectChannel(0);
                        }
                    });
                })
                .catch(error => console.log(error));


    }

    isLiveProgram(epg) {
        const currentTime = this.currentDate.getTime();
        const startTime = new Date(formatDate(this.currentDate) + ' ' + epg.s).getTime();
        const endTime = new Date(formatDate(this.currentDate) + ' ' + epg.e).getTime();
        return currentTime > startTime && currentTime < endTime;
    }

    initVOD() {
        this.player = window.jwplayer('live-tv-player');
        this.player.setup({
            autostart: true,
            file: this.state.selected_live_event_url.url,
            primary: 'html5',
            width: '100%',
            aspectratio: '16:9',
            displaytitle: true,
            setFullscreen: true,
            stretching: 'fill',
            advertising: {
                client: 'vast',
                tag: this.state.selected_live_event_url.vmap
            },
            logo: {
                hide: true
            }
        });
    }

    selectChannel(index) {
        this.setState({selected_index: index}, () => {
            this.props.getLiveEventUrl(this.state.live_events[this.state.selected_index].id)
                    .then(res => {
                        this.setState({
                            selected_live_event: this.state.live_events[this.state.selected_index],
                            selected_live_event_url: res.data.data
                        }, () => {
                            this.initVOD();
                            this.props.getEPG(formatDate(this.currentDate), this.state.selected_live_event.channel_code)
                                    .then(response => {
                                        this.setState({epg: response.data.data});
                                    })
                                    .catch(error => console.log(error));
                        });
                    })
                    .catch(error => console.log(error));
        });
    }

    selectCatchup(id) {
        this.props.getCatchupUrl(id)
                .then(r => {
                    console.log(r);
                })
                .catch(error => console.log(error));
    }

    toggleSelectModal() {
        this.setState({select_modal: !this.state.select_modal});
    }

    render() {
        return (
                <Layout className="live-tv-layout" title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <SelectDateModal 
                        open={this.state.select_modal}
                        data={this.state.dates_before}
                        toggle={this.toggleSelectModal.bind(this)}/>
                
                    <div className="wrapper-content" style={{height: 'calc(100vh)', padding: 0, margin: 0}}>
                        <div id="live-tv-player"></div>
                        <div className="tv-wrap">
                            <Row>
                                <Col xs={3} className="text-center">
                                <Button size="sm" color="link" className={this.state.selected_index === 0 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 0)}>RCTI</Button>
                                </Col>
                                <Col xs={3} className="text-center">
                                <Button size="sm" color="link" className={this.state.selected_index === 1 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 1)}>MNCTV</Button>
                                </Col>
                                <Col xs={3} className="text-center">
                                <Button size="sm" color="link" className={this.state.selected_index === 2 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 2)}>GTV</Button>
                                </Col>
                                <Col xs={3} className="text-center">
                                <Button size="sm" color="link" className={this.state.selected_index === 3 ? 'selected' : ''} onClick={this.selectChannel.bind(this, 3)}>INEWS</Button>
                                </Col>
                            </Row>
                        </div>
                        <Nav tabs className="tab-wrap">
                            <NavItem onClick={() => this.setState({selected_tab: 'live'})} className={this.state.selected_tab === 'live' ? 'selected' : ''}>
                                <NavLink>Live</NavLink>
                            </NavItem>
                            <NavItem onClick={() => this.setState({selected_tab: 'catch_up_tv'})} className={this.state.selected_tab === 'catch_up_tv' ? 'selected' : ''}>
                                <NavLink>Catch Up TV</NavLink>
                            </NavItem>
                        </Nav>
                        <div className="tab-content-wrap">
                            <TabContent activeTab={this.state.selected_tab}>
                                <TabPane tabId={'live'}>
                                    {this.state.epg.map(e => {
                                            if (this.isLiveProgram(e)) {
                                                return (<Row key={e.id} className={'program-item selected'}>
                                                    <Col xs={9}>
                                                    <div className="title">{e.title} <FiberManualRecordIcon/></div>
                                                    <div className="subtitle">{e.s} - {e.e}</div>
                                                    </Col>
                                                    <Col className="right-side">
                                                    <ShareIcon className="share-btn"/>
                                                    </Col>
                                                </Row>);
                                            }

                                            return (<Row key={e.id} className={'program-item'}>
                                                <Col xs={9}>
                                                <div className="title">{e.title}</div>
                                                <div className="subtitle">{e.s} - {e.e}</div>
                                                </Col>
                                            </Row>);
                                        })}
                
                                </TabPane>
                                <TabPane tabId={'catch_up_tv'}>
                                    <div className="catch-up-wrapper">
                                        <div className="catchup-dropdown-menu">
                                            <Button onClick={this.toggleSelectModal.bind(this)} size="sm" color="link">{this.props.chats.catchup_date} <ExpandMoreIcon/></Button>
                                        </div>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </div>
                
                    </div>
                </Layout>
                );
    }

}

export default connect(state => state, liveAndChatActions)(Live);
