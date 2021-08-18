import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import classnames from 'classnames';
import dynamic from 'next/dynamic';

import AllResult from './Result/AllResult';
import ProgramResult from './Result/ProgramResult';
import EpisodeResult from './Result/EpisodeResult';
import ExtraResult from './Result/ExtraResult';
import CatchupResult from './Result/CatchUpResult';
import ClipResult from './Result/ClipResult';
import PhotoResult from './Result/PhotoResult';

import searchActions from '../../redux/actions/searchActions';
import bookmarkActions from '../../redux/actions/bookmarkActions';

import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';

import '../../assets/scss/components/search-results.scss';

import { searchTabClicked, searchProgramClicked, searchScrollVerticalEvent } from '../../utils/appier';
import { showAlert } from '../../utils/helpers';
import { isIOS } from 'react-device-detect';

const ActionSheet = dynamic(() => import('../../components/Modals/ActionSheet'), { ssr: false });
class Result extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active_tab: 'all',
            results: [],
            meta: {},
            show_more_allowed: {},
            length: 9,
            action_sheet: false,
            urlShare: "",
            title: "title-program"
        };

        this.tabs = ['all', 'program', 'episode', 'catchup', 'extras', 'clips', 'photos'];
        this.swipe = {};
    }

    onTouchStart(e) {
		const touch = e.touches[0];
		this.swipe = { y: touch.clientY };
	}

	onTouchEnd(e) {
		const touch = e.changedTouches[0];
		const absY = Math.abs(touch.clientY - this.swipe.y);
		if (absY > 50) {
			searchScrollVerticalEvent('mweb_search_scroll_vertical');
		}
	}

    toggleTab(tab) {
        if (this.state.active_tab !== tab) {
            searchTabClicked('N/A', 'N/A', 'N/A', this.state.active_tab);
            this.setState({ active_tab: tab }, () => {
                this.props.setActiveTab(this.state.active_tab);
            });
        }
    }

    link(data, type) {
        this.props.popularTracking(data?.ref_id)
        searchProgramClicked(data.title, data.id, type, 'mweb_search_program_clicked');
		switch (type) {
			case 'program':                
				Router.push(`/programs/${data.id}/${data.title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}?ref=search`);
				break;
			default:
				Router.push(`/programs/${data.program_id}/${data.program_title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}/${type}/${data.id}/${data.title.replace(/ +/g, '-').replace(/#+/g, '').toLowerCase()}?ref=search`);
				break;
		}
	}

    alertDownload() {
        showAlert('To be able to watch this episode offline, please download RCTI+ application on ' + (isIOS ? 'App Store' : 'Playstore'),
             '',
             'Open ' + (isIOS ? 'App Store' : 'Playstore'),
             'Cancel', () => { window.open((isIOS ? 'https://apps.apple.com/us/app/rcti/id1472168599' : 'https://play.google.com/store/apps/details?id=com.fta.rctitv'), '_blank'); });
    }

    toggleActionSheet(title = 'title-program', url) {
        this.setState({
            action_sheet: !this.state.action_sheet,
            title: title,
            urlShare: url
        });
    
        return 'title-program';
    }

    addBookmark(){
        this.props.bookmark(15978,"episode")
    }

    deleteBookmark(){
        this.props.deleteBookmark(15978,"episode")
    }

    render() {
        return (
            <div className="search-results-container" onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}>
                <Nav tabs id="search-results">
                    {this.tabs.map((t, i) => (
                        <NavItem key={i} className="nav-tab-item">
                            <NavLink onClick={this.toggleTab.bind(this, t)} className={classnames({ active: this.state.active_tab === t })}>{t[0].toUpperCase() + t.substring(1)}</NavLink>
                        </NavItem>
                    ))}
                </Nav>
                <TabContent className="container-box-search-result" activeTab={this.state.active_tab}>
                    {this.state.active_tab === "all" && 
                        <AllResult 
                            handleTab={(val) => this.toggleTab(val) } 
                            onShare={(title, url, type) => this.toggleActionSheet(title, url)} 
                            onDownload={() => this.alertDownload()} 
                            onClick={(c, t) => this.link( c, t)} 
                        />
                    }
                    {this.state.active_tab === "program" && <ProgramResult onClick={(c) => this.link( c, "program")}  />}
                    {this.state.active_tab === "episode" && 
                        <EpisodeResult 
                            onShare={(title, url) => this.toggleActionSheet(title, url)} 
                            onDownload={() => this.alertDownload()} 
                            onClick={(c) => this.link(c, "episode")} 
                        />
                    }
                    {this.state.active_tab === "extras" && 
                        <ExtraResult 
                            onShare={(title, url) => this.toggleActionSheet(title, url)} 
                            onDownload={() => this.alertDownload()} 
                            onClick={(c) => this.link(c, "extras")}  
                        />
                    }
                    {this.state.active_tab === "catchup" && 
                        <CatchupResult 
                            onShare={(title, url) => this.toggleActionSheet(title, url)} 
                            onClick={(c) => this.link(c, "catchup")} 
                        />
                    }
                    {this.state.active_tab === "clips" && 
                        <ClipResult 
                            onShare={(title, url) => this.toggleActionSheet( title, url)} 
                            onDownload={() => this.alertDownload()} 
                            onClick={(c) => this.link(c, "clips")} 
                        />
                    }
                    {this.state.active_tab === "photos" && <PhotoResult onClick={(c) => this.link(c, "photo")} />}
                </TabContent>

                { this.state.action_sheet &&
                    <ActionSheet
                        toggle={this.toggleActionSheet.bind(this)}
                        caption={this.state.title}
                        url={this.state.urlShare}
                        open={this.state.action_sheet}
                    />
                }
            </div>
        );
    }
}

export default connect(state => state, {
	...bookmarkActions,
	...searchActions
})(Result);

{/* {this.tabs.map((t, i) => (
                        <TabPane key={i} tabId={t}>
                            <div style={{background: "#282828"}} className="content-search">
                                <div className="header-list">
                                    <p className="title">Result</p>
                                </div>
                                <div className="content-list">
                                    
                                    <Row>

                                        {!this.props.searches.search_status ? '' : !this.props.searches.search_results[i] || this.props.searches.search_results[i].status !== 200 || this.props.searches.search_results[i].data.status.code !== 0 || this.props.searches.search_results[i].data.data.length <= 0 ? (<div style={{ 
                                            textAlign: 'center',
                                            margin: 30
                                            }}>
                                            <SentimentVeryDissatisfiedIcon style={{ fontSize: '4rem' }}/>
                                            <h5 style={{ color: '#8f8f8f' }}>
                                                <strong style={{ fontSize: 14 }}>Uhh, your keywords don't match with our database!</strong><br/>
                                                <span style={{ fontSize: 12 }}>Cheer up, we still have other exciting programs!</span><br/>
                                            </h5>
                                        </div>) : (<div></div>)}
                                        
                                        {this.props.searches.search_results[i] && this.props.searches.search_results[i].status === 200 && this.props.searches.search_results[i].data.status.code === 0 && this.props.searches.search_results[i].data.data.map((c, i) => (
                                            <Col xs={4} key={i} onClick={this.link.bind(this, c, t)}>
                                                { c.premium ? (
													<div className="paid-label">
														<div style={{ position: 'relative', display: 'flex' }}>
															<span className="title-paid-video">Premium</span>
															<span className="icon-paid-video">
																<img src="/icons-menu/crown_icon@3x.png" alt="icon-video"/>
															</span>
														</div>
													</div>
                                                    ) : c.label !== undefined || c.label !== '' ? (
                                                        <div className="new-label" style={c.label === undefined || c.label === '' ? { display: 'none' } : { display: 'block' }}>{ c.label }</div>
                                                    ) : ''
											    }
                                                <Img 
                                                    alt={c.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[this.props.searches.meta.image_path + this.props.resolution + c.portrait_image, '/static/placeholders/placeholder_potrait.png']} />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                    ))} */}