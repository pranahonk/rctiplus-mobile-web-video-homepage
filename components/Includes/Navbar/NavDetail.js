import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';

import { Navbar, NavbarBrand } from 'reactstrap';
import queryString from 'query-string';
import { contentGeneralEvent, libraryProgramBackClicked } from '../../../utils/appier';

import '../../../assets/scss/components/navbar.scss';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StatusNotification from './StatusNotification';

class NavbarDetail extends Component {

    constructor(props) {
		super(props);
		this.state = {
			is_top: true
		};

		const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
		}
	}

    componentDidMount() {
		document.addEventListener('scroll', () => {
			const isTop = window.scrollY < 150;
			if (isTop !== this.state.is_top) {
				this.setState({ is_top: isTop });
			}
		});
	}

	goBack() {
		if (this.props.data && this.reference) {
			const data = this.props.data.data;
			const meta = this.props.data.meta;
			let genre = [];
			for (let i = 0; i < data.genre.length; i++) {
				genre.push(data.genre[i].name);
			}
			switch (this.reference) {
				case 'homepage':
					contentGeneralEvent('N/A', 'program', data.id, data.title, data.title, genre.join(','), meta.image_path + '593' + data.portrait_image, meta.image_path + '593' + data.landscape_image, 'mweb_homepage_program_back_clicked');
					break;

				case 'library':
					libraryProgramBackClicked(data.title, data.id, 'program', 'mweb_library_program_back_clicked');
					break;
			}
			
		}
		Router.back();
	}

	render() {
		return (
			<div className="nav-home-container nav-fixed-top">
				<Navbar expand="md" className={'nav-container nav-shadow ' + (this.state.is_top ? 'nav-transparent' : '')}>
					<div className="top-link">
						<div className={'logo-top-wrapper ' + (this.state.is_top ? 'back-arrow-transparent' : '')}>
							<NavbarBrand onClick={this.goBack.bind(this)} style={{ color: 'white' }}>
								<ArrowBackIcon/>
							</NavbarBrand>
						</div>
					</div>
					<div className="header-nav-verif">
						<p>{this.props.title}</p>
					</div>
				</Navbar>
				<StatusNotification/>
			</div>
		);
    }
    
}
export default withRouter(NavbarDetail);
