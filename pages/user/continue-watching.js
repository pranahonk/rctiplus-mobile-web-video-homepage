import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import historyActions from '../../redux/actions/historyActions';

import initialize from '../../utils/initialize';
import { showAlert } from '../../utils/helpers';
import { accountContinueWatchingContentClicked, accountContinueWatchingRemoveContinueWatchingClicked, accountContinueWatchingShareClicked } from '../../utils/appier';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';
import Bar from '../../components/Includes/Common/Bar';
import ActionSheet from '../../components/Modals/ActionSheet';

import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap';
import ShareIcon from '@material-ui/icons/Share';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import '../../assets/scss/components/continue-watching.scss';

class ContinueWatching extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			dropdown_open: false,
			order_by: '',
			page: 1,
			length: 10,
			continue_watches: [],
			ordered_watches: [],
			meta: {},
			load_more_allowed: true,
			resolution: 300,
			action_sheet: false,
			caption: '',
			hashtags: [],
			url: '',
			first_load: true
		};
	}

	componentDidMount() {
		this.loadMore();
	}

	toggleDropdown() {
		this.setState({ dropdown_open: !this.state.dropdown_open });
	}

	toggleActionSheet(caption = '', url = '', hashtags = [], cw = null) {
		if (cw && !this.state.action_sheet) {
			accountContinueWatchingShareClicked(cw.program_id, cw.program_title, cw.content_title, cw.content_type, cw.content_id, 'mweb_account_continue_watching_share_clicked');
		}
		
		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		});
	}

	orderBy(order) {
		this.setState({ order_by: order }, () => {
			switch (this.state.order_by) {
				case 'title':
					let continueWatches = this.state.continue_watches.slice();
					continueWatches.sort((a, b) => (a.title > b.title) ? 1 : -1);
					this.setState({ ordered_watches: continueWatches });
					break;

				default:
					this.setState({ ordered_watches: this.state.continue_watches.slice() });
					break;
			}
		});
	}

	loadMore() {
		if (this.state.load_more_allowed) {
			this.LoadingBar.continuousStart();
			this.props.getContinueWatching(this.state.page, this.state.length)
				.then(response => {
					if (response.status === 200 && response.data.status.code === 0) {
						let continueWatches = this.state.continue_watches;
						continueWatches.push.apply(continueWatches, response.data.data);
						let orderedWatches = this.state.ordered_watches;
						orderedWatches.push.apply(orderedWatches, response.data.data);
						this.setState({
							page: this.state.page + 1,
							continue_watches: continueWatches,
							ordered_watches: orderedWatches,
							meta: response.data.meta,
							load_more_allowed: response.data.data.length >= this.state.length,
							first_load: false
						}, () => this.orderBy(this.state.order_by));
					}

					this.LoadingBar.complete()
				})
				.catch(error => {
					console.log(error);
					this.LoadingBar.complete();
					this.setState({ first_load: false });
				});
		}
		
	}

	showOpenPlaystoreAlert() {
        showAlert('To be able to see and watching your downloaded file, please download RCTI+ application on Playstore', '', 'Open Playstore', 'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); });
	}
	
	deleteContinueWatching(cw, idx) {
		this.LoadingBar.continuousStart();
		this.props.deleteContinueWatchingByContentId(cw.content_id, cw.content_type)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					accountContinueWatchingRemoveContinueWatchingClicked(cw.content_type, cw.content_id, cw.content_title, cw.program_title, cw.genre, this.state.meta.image_path + this.state.resolution + cw.portrait_image, this.state.meta.image_path + this.state.resolution + cw.landscape_image, cw.last_duration, cw.duration, 'mweb_account_continue_watching_remove_continue_watching_clicked');

					let orderedWatches = this.state.ordered_watches;
					orderedWatches.splice(idx, 1);
					idx = -1;
					for (let i = 0; i < this.state.continue_watches.length; i++) {
						if (this.state.continue_watches[i].content_id == cw.content_id) {
							idx = i;
							break;
						}
					}
					let continueWatches = this.state.continue_watches;
					if (idx != -1) {
						continueWatches.splice(idx, 1);
					}
					
					this.setState({ ordered_watches: orderedWatches, continue_watches: continueWatches });
				}

				this.LoadingBar.complete();
			})
			.catch(error => {
				console.log(error);
				this.LoadingBar.complete();
			});
	}

	renderTitle(cw) {
		switch (cw.content_type) {
			case 'episode':
				return (
					<span>
						S{cw.season}:E{cw.episode}<br/>
						{cw.content_title}
					</span>
					
				);
			
			default:
				return <span>{cw.content_title}</span>;
		}
	}

	link(cw) {
		accountContinueWatchingContentClicked(cw.program_id, cw.program_title, cw.content_title, cw.content_type, cw.content_id, 'mweb_account_continue_watching_content_clicked');
		Router.push(`/programs/${cw.program_id}/${cw.program_title.replace(' ', '-').toLowerCase()}/${cw.content_type}/${cw.content_id}/${cw.content_title.replace(' ', '-').toLowerCase()}?ref=continue_watching`);
	}

	renderContent() {
		if (!this.state.first_load && this.state.continue_watches.length <= 0) {
			return (
				<div style={{ 
					textAlign: 'center',
					position: 'fixed', 
					top: '50%', 
					left: '50%',
					transform: 'translate(-50%, -50%)' 
					}}>
					<SentimentVeryDissatisfiedIcon style={{ fontSize: '4rem' }}/>
					<h5>
						<strong>Sorry, we can not find what you are looking for.</strong><br/><br/>
						<Button onClick={() => Router.back()} className="btn-next block-btn">Go Back</Button>
					</h5>
				</div>
			);
		}

		return (
			<div>
				<div className="header-list">
					<p className="header-subtitle">Continue Watching</p>
					<ButtonDropdown isOpen={this.state.dropdown_open} toggle={this.toggleDropdown.bind(this)}>
						<DropdownToggle caret>
							{this.state.order_by == 'date' ? 'Latest Post' : (this.state.order_by == 'title' ? 'A-Z' : 'Sort By')}
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem onClick={this.orderBy.bind(this, '')} className={this.state.order_by == '' ? 'active' : ''}>Sort By</DropdownItem>
							<DropdownItem onClick={this.orderBy.bind(this, 'date')} className={this.state.order_by == 'date' ? 'active' : ''}>Latest Post</DropdownItem>
							<DropdownItem onClick={this.orderBy.bind(this, 'title')} className={this.state.order_by == 'title' ? 'active' : ''}>A-Z</DropdownItem>
						</DropdownMenu>
					</ButtonDropdown>
				</div>
				<div className="list-content">
					{this.state.ordered_watches.map((cw, i) => (
						<Row key={i}>
							<Col xs={6} onClick={() => this.link(cw)}>
								<Img 
									alt={cw.content_title} 
									className="list-item-thumbnail" 
									src={[this.state.meta.image_path + this.state.resolution + cw.landscape_image,'/static/placeholders/placeholder_landscape.png']} 
									loader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}
									unloader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}/>
								<Bar percentage={(cw.last_duration / cw.duration) * 100} />
							</Col>
							<Col xs={6}>
								<p className="item-title" onClick={() => this.link(cw)}>
									{this.renderTitle(cw)}
								</p>
								<p className="item-subtitle"><small>{cw.content_type}</small></p>
								<div className="item-action-buttons">
									<div className="action-button">
										<DeleteForeverIcon className="action-icon" onClick={this.deleteContinueWatching.bind(this, cw, i)}/>
									</div>
									<div className="action-button">
										<ShareIcon onClick={this.toggleActionSheet.bind(this, cw.content_title, cw.share_link, ['rcti'], cw)} className="action-icon" />
									</div>
									<div className="action-button">
										<GetAppIcon className="action-icon" onClick={this.showOpenPlaystoreAlert.bind(this)}/>
									</div>
								</div>
							</Col>
						</Row>
					))}
				</div>
			</div>
		);
	}

	render() {
		return (
			<Layout title="RCTI+ - Continue Watching">
				<NavBack title="Continue Watching" />
				<BottomScrollListener offset={8} onBottom={this.loadMore.bind(this)} />
				<LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<ActionSheet
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, '', '', ['rcti'])} />
				<div className="wrapper-content container-box-cw">
					{this.renderContent()}
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, historyActions)(ContinueWatching);
