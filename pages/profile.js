import React from 'react'
import Router from 'next/router';
import { connect } from 'react-redux';
import Img from 'react-image';

import userActions from '../redux/actions/userActions';
import initialize from '../utils/initialize';
import { showAlert } from '../utils/helpers';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavDefault from '../components/Includes/Navbar/NavDefault';

import { ListGroup, ListGroupItem } from 'reactstrap';
import HistoryIcon from '@material-ui/icons/History';
import GetAppIcon from '@material-ui/icons/GetApp';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import '../assets/scss/components/profile.scss';

class Profile extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			profile_picture_url: '/static/placeholders/placeholder_landscape.png',
			logged_in: false
		};
	}

	componentDidMount() {
		this.props.getUserData()
			.then(response => {
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({ profile_picture_url: response.data.data.photo_url, logged_in: true });
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	showOpenPlaystoreAlert() {
        showAlert('To be able to see and watching your downloaded file, please download RCTI+ application on Playstore', '', 'Open Playstore', 'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); });
    }

	render() {
		return (
			<Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
				<NavDefault disableScrollListener/>
				<ListGroup className="list-menu-container">
					<ListGroupItem onClick={() => Router.push('/edit-profile')}>
						<Img 
							alt={'Azhary Arliansyah'}
							unloader={<img className="rounded-profile-picture MuiSvgIcon-root" src="/static/placeholders/placeholder_landscape.png"/>}
							loader={<img className="rounded-profile-picture MuiSvgIcon-root" src="/static/placeholders/placeholder_landscape.png"/>} 
							className="rounded-profile-picture MuiSvgIcon-root" 
							src={[this.state.profile_picture_url, '/static/placeholders/placeholder_landscape.png']} /> Azhary Arliansyah
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/qrcode')}>
						<img className="MuiSvgIcon-root" src="static/btn/qrcode.png"/> Scan QR Code
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/history')}>
						<HistoryIcon/> History
					</ListGroupItem>
					<ListGroupItem onClick={this.showOpenPlaystoreAlert.bind(this)}>
						<GetAppIcon/> Download
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/mylist')}>
						<PlaylistAddCheckIcon/> My List
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/continue-watching')}>
						<QueryBuilderIcon/> Continue Watching
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/terms-&-conditions')}>
						<InfoOutlinedIcon/> Term &amp; Condition
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/privacy-policy')}>
						<LockOutlinedIcon/> Privacy Policy
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/contact-us')}>
						<MailOutlineOutlinedIcon/> Contact Us
					</ListGroupItem>
					<ListGroupItem onClick={() => Router.push('/faq')}>
						<HelpOutlineOutlinedIcon/> FAQ
					</ListGroupItem>
				</ListGroup>
			</Layout>
		);
	}

}

export default connect(state => state, userActions)(Profile);
