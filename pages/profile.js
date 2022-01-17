import React from 'react'
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Img from 'react-image';
import Head from 'next/head';

import userActions from '../redux/actions/userActions';
import historyActions from '../redux/actions/historyActions';
import pageActions from '../redux/actions/pageActions';

import initialize from '../utils/initialize';
import { showAlert, showSignInAlert } from '../utils/helpers';
import { accountGeneralEvent } from '../utils/appier';

import Layout from '../components/Layouts/Default_v2';
// import NavDefault from '../components/Includes/Navbar/NavDefault_v2';
import Bar from '../components/Includes/Common/Bar';

import { ListGroup, ListGroupItem, Button, Badge } from 'reactstrap';
import LoadingBar from 'react-top-loading-bar';

import HistoryIcon from '@material-ui/icons/History';
import GetAppIcon from '@material-ui/icons/GetApp';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import HeadsetMic from '@material-ui/icons/HeadsetMic';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG, WA_CS } from '../config';

import '../assets/scss/components/profile.scss';

class Profile extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			profile_picture_url: '/static/placeholders/placeholder_landscape.png',
			logged_in: false,
			display_name: '',
			page: 1,
			length: 10,
			continue_watches: [],
			ordered_watches: [],
			meta: null,
			user_data: null
		};
		this.props.setPageLoader();
	}

	isProfileComplete() {
		if (this.state.user_data) {
			const data = this.state.user_data;
			return data.nickname && data.display_name && data.email && data.phone_number && data.dob && data.gender && data.photo_url;
		}
		return false;
	}

	componentDidMount() {
		console.log(this.props)
		this.props.getUserData()
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					console.log(response.data.data);
					const data = response.data.data;
					this.setState({
						profile_picture_url: response.data.data.photo_url,
						user_data: data,
						display_name: data.display_name ? data.display_name : data.email ? data.email : data.phone_number ? data.phone_number : '',
						logged_in: true
					}, () => this.loadMore());
				}
				else {
					this.props.unsetPageLoader();
				}
			})
			.catch(error => {
				console.log(error);
				this.props.unsetPageLoader();
			});
	}

	loadMore() {
		this.LoadingBar.continuousStart();
		this.props.getContinueWatching(this.state.page, this.state.length)
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					let continueWatches = this.state.continue_watches;
					continueWatches.push.apply(continueWatches, response.data.data);
					let orderedWatches = this.state.ordered_watches;
					orderedWatches.push.apply(orderedWatches, response.data.data);
					this.setState({
						continue_watches: continueWatches,
						ordered_watches: orderedWatches,
						meta: response.data.meta
					});
				}

				this.props.unsetPageLoader();
				this.LoadingBar.complete()
			})
			.catch(error => {
				console.log(error);
				this.LoadingBar.complete();
				this.props.unsetPageLoader();
				this.setState({ first_load: false });
			});
	}

	showOpenPlaystoreAlert() {
        showAlert('To be able to see and watching your downloaded file, please download RCTI+ application on Playstore', '', 'Open Playstore', 'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); }, false, 'popup-action-openstore', 'popup-action-cancel');
	}

	link(cw) {
		Router.push(`/programs/${cw.program_id}/${cw.program_title.replace(' ', '-').toLowerCase()}/${cw.content_type}/${cw.content_id}/${cw.content_title.replace(' ', '-').toLowerCase()}?ref=continue_watching`);
	}

	render() {
		let actionProfile = (
			<div className="profile-action">
				<p><AccountCircleIcon/> Hi</p>
				<p className="subtitle" style={{color: '#ffffff'}}>To enjoy all the features, please login now</p>
				<p className="sub-btn"><Button id="button-login" onClick={() => {
					accountGeneralEvent('mweb_account_signin_clicked');
					Router.push('/login');
				}} className="btn-next btn-login">Login</Button></p>
			</div>
		);
		if (this.state.logged_in) {
			actionProfile = (
				<div id="action-profile" onClick={() => {
					accountGeneralEvent('mweb_account_edit_profile_clicked');
					Router.push('/edit-profile');
				}}>
					<div style={{
						display: 'inline-block',
						position: 'relative',
						width: 30,
						height: 30,
						marginRight: 10
					}}>
						<Img
							alt={this.state.display_name}
							unloader={<img className="rounded-profile-picture MuiSvgIcon-root" src="/static/placeholders/placeholder_landscape.png"/>}
							loader={<img className="rounded-profile-picture MuiSvgIcon-root" src="/static/placeholders/placeholder_landscape.png"/>}
							className="rounded-profile-picture MuiSvgIcon-root"
							src={[this.state.profile_picture_url, '/static/placeholders/placeholder_landscape.png']} />
							{!this.isProfileComplete() ? (<Badge className="ribbon" color="danger"> </Badge>) : null}
					</div> {this.state.display_name}
				</div>
			);
		}

		return (
			<Layout title={"Profile User - RCTI+"}>
				<Head>
					<meta name="description" content={"Profile user untuk melanjutkan video yang belum selesai ditonton"}/>
					<meta name="keywords" content={"rctiplus, rcti+"}/>
					<meta property="og:title" content={"Profile User - RCTI+"} />
					<meta property="og:description" content={"Profile user untuk melanjutkan video yang belum selesai ditonton"} />
					<meta property="og:image" itemProp="image" content={"https://rctiplus.com/assets/image/elements/logo.b9f35229.png"} />
					<meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
					<meta property="og:image:type" content="image/jpeg" />
					<meta property="og:image:width" content="600" />
					<meta property="og:image:height" content="315" />
					<meta property="og:site_name" content={SITE_NAME} />
					<meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
					<meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
					<meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
					<meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
					<meta name="twitter:image" content={"https://rctiplus.com/assets/image/elements/logo.b9f35229.png"} />
					<meta name="twitter:image:alt" content={"Profile User - RCTI+"} />
					<meta name="twitter:title" content={"Profile User - RCTI+"} />
					<meta name="twitter:description" content={"Profile user untuk melanjutkan video yang belum selesai ditonton"} />
					<meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
					<meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
				</Head>
				{/* <NavDefault disableScrollListener/> */}
				<div style={{padding: 10}}>
					<img src="/static/logo/rcti-sm.png" alt="Logo RCTI+" style={{width: 30}}/>
				</div>
				<LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
				<ListGroup className="list-menu-container">
					<ListGroupItem className="navbar-profile">
						{actionProfile}
					</ListGroupItem>
					<ListGroupItem id="action-qrcode" onClick={() => {
						accountGeneralEvent('mweb_account_scan_qrcode_clicked');
						Router.push('/qrcode');
					}}>
						<img className="MuiSvgIcon-root" src="static/btn/qrcode.png"/> Scan QR Code
					</ListGroupItem>
					<ListGroupItem id="action-history" onClick={() => {
						accountGeneralEvent('mweb_account_history_clicked');
						if (!this.state.logged_in) {
							showSignInAlert(`Please <b>Sign In</b><br/>
							Woops! Gonna sign in first!<br/>
							Only a click away and you<br/>
							can continue to enjoy<br/>
							<b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true, 'pop-up-action-sign-up', 'pop-up-action-sign-in');
						}
						else {
							Router.push('/history');
						}
					}}>
						<HistoryIcon/> History
					</ListGroupItem>
					<ListGroupItem id="action-download" onClick={this.showOpenPlaystoreAlert.bind(this)}>
						<GetAppIcon/> Download
					</ListGroupItem>
					<ListGroupItem id="action-mylist" onClick={() => {
						accountGeneralEvent('mweb_account_mylist_clicked');
						if (!this.state.logged_in) {
							showSignInAlert(`Please <b>Sign In</b><br/>
							Woops! Gonna sign in first!<br/>
							Only a click away and you<br/>
							can continue to enjoy<br/>
							<b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true, 'pop-up-action-sign-up', 'pop-up-action-sign-in');
						}
						else {
							Router.push('/mylist');
						}
					}}>
						<PlaylistAddCheckIcon/> My List
					</ListGroupItem>
					<ListGroupItem id="action-continue-watching" onClick={() => {
						accountGeneralEvent('mweb_account_continue_watching_clicked');
						if (!this.state.logged_in) {
							showSignInAlert(`Please <b>Sign In</b><br/>
							Woops! Gonna sign in first!<br/>
							Only a click away and you<br/>
							can continue to enjoy<br/>
							<b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true, 'pop-up-action-sign-up', 'pop-up-action-sign-in');
						}
						else {
							Router.push('/continue-watching');
						}
					}}>
						<QueryBuilderIcon/> Continue Watching <br/>
						<div className="cw-container">
							{this.state.ordered_watches.map((cw, i) => (
								<div key={i} className="cw-item" onClick={() => this.link(cw)}>
									<Img
										alt={cw.title}
										className="list-item-thumbnail"
										src={[this.state.meta.image_path + RESOLUTION_IMG + cw.landscape_image, '/static/placeholders/placeholder_landscape.png']}
										loader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}
										unloader={<img className="list-item-thumbnail" src="/static/placeholders/placeholder_landscape.png"/>}/>
									<Bar percentage={(cw.last_duration / cw.duration) * 100} />
								</div>
							))}
						</div>
					</ListGroupItem>
					<ListGroupItem id="action-tnc" onClick={() => {
						accountGeneralEvent('mweb_account_tnc_clicked');
						Router.push('/terms-&-conditions');
					}}>
						<InfoOutlinedIcon/> Term &amp; Condition
					</ListGroupItem>
					<ListGroupItem id="action-privacy-policy" onClick={() => {
						accountGeneralEvent('mweb_account_privacy_policy_clicked');
						Router.push('/privacy-policy');
					}}>
						<LockOutlinedIcon/> Privacy Policy
					</ListGroupItem>
					<ListGroupItem id="action-contact-us" onClick={() => {
						accountGeneralEvent('mweb_account_contact_us_clicked');
						Router.push('/contact-us');
					}}>
						<MailOutlineOutlinedIcon/> Contact Us
					</ListGroupItem>
					<ListGroupItem id="action-cs" onClick={() => {window.open(WA_CS , '_blank')}}>
						<HeadsetMic/> Customer Service
					</ListGroupItem>
          <ListGroupItem id="action-faq" onClick={() => Router.push('/faq')}>
						<HelpOutlineOutlinedIcon/> FAQ
					</ListGroupItem>
				</ListGroup>
			</Layout>
		);
	}

}

export default connect(state => state, {
	...userActions,
	...historyActions,
	...pageActions
})(withRouter(Profile));
