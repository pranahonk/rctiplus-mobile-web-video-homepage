import React from 'react'
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import Img from 'react-image';

import historyActions from '../../redux/actions/historyActions';
import bookmarkActions from '../../redux/actions/bookmarkActions';
import pageActions from '../../redux/actions/pageActions';

import initialize from '../../utils/initialize';
import { showAlert } from '../../utils/helpers';
import { accountGeneralEvent, accountHistoryClearHistoryClicked, accountHistoryContentClicked, accountHistoryShareClicked, accountHistoryDownloadClicked } from '../../utils/appier';

import Layout from '../../components/Layouts/Default';
import NavBack from '../../components/Includes/Navbar/NavBack';
import Bar from '../../components/Includes/Common/Bar';
import ActionSheet from '../../components/Modals/ActionSheet';

import { ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, Row, Col, Button } from 'reactstrap';
import ShareIcon from '@material-ui/icons/Share';
import GetAppIcon from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import '../../assets/scss/components/history.scss';

class History extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			dropdown_open: false,
			order_by: 'date',
			resolution: 200,
			page: 1,
			length: 10,
			load_more_allowed: true,
			action_sheet: false,
			caption: '',
			hashtags: [],
			url: '',
			first_load: true,
			histories: [],
			ordered_histories: [],
			meta: {}
		};
	}

	componentDidMount() {
		this.loadMore();
	}

	clearHistory() {
		this.props.setPageLoader();
		this.LoadingBar.continuousStart();
		this.props.deleteHistory()
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					const histories = this.state.histories;
					for (let i = 0; i < histories.length; i++) {
						accountHistoryClearHistoryClicked(histories[i].program_id, histories[i].program_title, histories[i].content_id, histories[i].content_title, 'mweb_account_history_clear_history_clicked');
					}
					this.setState({
						page: 1,
						histories: [],
						ordered_histories: []
					}, () => this.loadMore());
				}
				this.props.unsetPageLoader();
				this.LoadingBar.complete();
			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
				this.LoadingBar.complete();
			});
	}

	loadMore() {
		if (this.state.load_more_allowed) {
			this.LoadingBar.continuousStart();
			this.props.setPageLoader();
			this.props.getUserHistory(this.state.page, this.state.length)
				.then(response => {
					if (response.status === 200 && response.data.status.code === 0) {
						let histories = this.state.histories;
						histories.push.apply(histories, response.data.data);
						let orderedHistories = this.state.ordered_histories;
						orderedHistories.push.apply(orderedHistories, response.data.data);
						this.setState({
							page: this.state.page + 1,
							histories: histories,
							ordered_histories: orderedHistories,
							meta: response.data.meta,
							load_more_allowed: response.data.data.length >= this.state.length,
							first_load: false
						}, () => this.orderBy(this.state.order_by, true));
					}

					this.LoadingBar.complete()
					this.props.unsetPageLoader();
				})
				.catch(error => {
					console.log(error);
					this.LoadingBar.complete();
					this.props.unsetPageLoader();
					this.setState({ first_load: false });
				});
		}
	}

	orderBy(order, first = false) {
		this.setState({ order_by: order }, () => {
			switch (this.state.order_by) {
				case 'title':
					let histories = this.state.histories.slice();
					histories.sort((a, b) => (a.title > b.title) ? 1 : -1);
					this.setState({ ordered_histories: histories }, () => {
						if (!first) {
							accountGeneralEvent('mweb_account_history_filter_asc_clicked');
						}
					});
					break;

				default:
					this.setState({ ordered_histories: this.state.histories.slice() }, () => {
						if (!first) {
							accountGeneralEvent('mweb_account_history_filter_latest_post_clicked');
						}
					});
					break;
			}
		});
	}

	toggleDropdown() {
		this.setState({ dropdown_open: !this.state.dropdown_open }, () => {
			if (this.state.dropdown_open) {
				accountGeneralEvent('mweb_account_history_filter_clicked');
			}
		});
	}

	toggleActionSheet(caption = '', url = '', hashtags = [], cw = null) {
		if (cw && !this.state.action_sheet) {
			accountHistoryShareClicked(cw.program_id, cw.program_title, cw.content_title, cw.content_type, cw.content_id, 'mweb_account_history_share_clicked');
		}

		this.setState({
			action_sheet: !this.state.action_sheet,
			caption: caption,
			url: url,
			hashtags: hashtags
		});
	}

	showOpenPlaystoreAlert(cw) {
		accountHistoryDownloadClicked(cw.program_id, cw.program_title, cw.content_title, cw.content_type, cw.content_id, 'mweb_account_history_download_clicked');
		showAlert('To be able to see and watching your downloaded file, please download RCTI+ application on Playstore', '', 'Open Playstore', 'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); });
	}

	link(cw) {
		accountHistoryContentClicked(cw.program_id, cw.program_title, cw.content_title, cw.content_type, cw.content_id, 'mweb_account_history_content_clicked');
		Router.push(`/programs/${cw.program_id}/${cw.program_title.replace(' ', '-').toLowerCase()}/${cw.content_type}/${cw.content_id}/${cw.content_title.replace(' ', '-').toLowerCase()}?ref=history`);
	}

	addToMyList(id, type) {
		accountGeneralEvent('mweb_account_history_add_mylist_clicked');
		this.props.setPageLoader();
		this.props.bookmark(id, type)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					let histories = this.state.histories;
					let orderedHistories = this.state.ordered_histories;

					for (let i = 0; i < histories.length; i++) {
						if (histories[i].content_id === id) {
							histories[i].is_bookmark = 1;
						}
						if (orderedHistories[i].content_id === id) {
							orderedHistories[i].is_bookmark = 1;
						}
					}

					this.setState({
						histories: histories,
						ordered_histories: orderedHistories
					}, () => this.props.unsetPageLoader());
				}
			})
			.catch(error => {
				console.log(error);
				if (error.status === 200) {
					showAlert(error.data.status.message_client, '', 'Login', '', () => Router.push('/login'));
				}
				this.props.unsetPageLoader();
			});
	}

	deleteFromMyList(id, type) {
		this.props.setPageLoader();
		this.props.deleteBookmark(id, type)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					let histories = this.state.histories;
					let orderedHistories = this.state.ordered_histories;

					for (let i = 0; i < histories.length; i++) {
						if (histories[i].content_id === id) {
							histories[i].is_bookmark = 0;
						}
						if (orderedHistories[i].content_id === id) {
							orderedHistories[i].is_bookmark = 0;
						}
					}

					this.setState({
						histories: histories,
						ordered_histories: orderedHistories
					}, () => this.props.unsetPageLoader());
				}

			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
			});
	}

	renderTitle(cw) {
		switch (cw.content_type) {
			case 'episode':
				return (
					<span>
						S{cw.season}:E{cw.episode}<br />
						{cw.content_title}
					</span>

				);

			default:
				return <span>{cw.content_title}</span>;
		}
	}

	renderContent() {
		if (!this.state.first_load && this.state.histories.length <= 0) {
			return (
				<div style={{
					textAlign: 'center',
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)'
				}}>
					<SentimentVeryDissatisfiedIcon style={{ fontSize: '4rem' }} />
					<h5>
						<strong>Sorry, we can not find what you are looking for.</strong><br /><br />
						<Button onClick={() => Router.back()} className="btn-next block-btn">Go Back</Button>
					</h5>
				</div>
			);
		}

		return (
			<div>
				<div className="header-list">
					<p className="header-subtitle">History</p>
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
					{this.state.ordered_histories.map((cw, i) => (
						<Row key={i}>
							<Col xs={6} onClick={() => this.link(cw)}>
								<Img
									alt={cw.content_title}
									className="list-item-thumbnail"
									src={[this.state.meta.image_path + this.state.resolution + cw.landscape_image, '/static/placeholders/placeholder_landscape.png']}
									loader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
									unloader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png" />} />
								<Bar percentage={(cw.last_duration / cw.duration) * 100} />
							</Col>
							<Col xs={6}>
								<p className="item-title" onClick={() => this.link(cw)}>
									{this.renderTitle(cw)}
								</p>
								<p className="item-subtitle"><small>{cw.content_type}</small></p>
								<div className="item-action-buttons">
									<div className="action-button">
										{cw.is_bookmark == 1 ? (<PlaylistAddCheckIcon className="action-icon action-icon__playlist-check" onClick={this.deleteFromMyList.bind(this, cw.content_id, cw.content_type)} />) : (<PlaylistAddIcon className="action-icon" onClick={this.addToMyList.bind(this, cw.content_id, cw.content_type)} />)}

									</div>
									<div className="action-button">
										<ShareIcon onClick={this.toggleActionSheet.bind(this, cw.content_title, cw.share_link, ['rcti'], cw)} className="action-icon" />
									</div>
									<div className="action-button">
										<GetAppIcon className="action-icon" onClick={this.showOpenPlaystoreAlert.bind(this, cw)} />
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
			<Layout title="RCTI+ - History">
				<NavBack
					visible
					title="History"
					dropdownMenu={[
						{
							label: 'Clear History',
							callback: () => this.clearHistory()
						}
					]} />
				<BottomScrollListener offset={18} onBottom={this.loadMore.bind(this)} />
				<LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<ActionSheet
					caption={this.state.caption}
					url={this.state.url}
					open={this.state.action_sheet}
					hashtags={this.state.hashtags}
					toggle={this.toggleActionSheet.bind(this, '', '', ['rcti'])} />
				<div className="wrapper-content container-box-hist">
					{this.renderContent()}
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {
	...historyActions,
	...bookmarkActions,
	...pageActions
})(History);
