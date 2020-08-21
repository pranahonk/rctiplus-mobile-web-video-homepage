import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Img from 'react-image';
import classnames from 'classnames';

import searchActions from '../../redux/actions/searchActions';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import '../../assets/scss/components/search-results.scss';

import { searchTabClicked, searchProgramClicked, searchScrollVerticalEvent } from '../../utils/appier';

class Result extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active_tab: 'program',
            results: [],
            meta: {},
            show_more_allowed: {},
            length: 9
        };

        this.tabs = ['program', 'episode', 'extra', 'clip', 'photo'];
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
                    {this.tabs.map((t, i) => (
                        <TabPane key={i} tabId={t}>
                            <div className="content-search">
                                <div className="header-list">
                                    <p className="title">Search Result</p>
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
                                                <div className="new-label" style={c.label !== undefined || c.label !== '' ? { display: 'none' } : { display: 'block' }}>{ c.label }</div>
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
                    ))}
                    
                </TabContent>
            </div>
        );
    }

}

export default connect(state => state, searchActions)(Result);