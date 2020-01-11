import React from 'react'
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';
import bookmarkActions from '../../redux/actions/bookmarkActions';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/my-list.scss';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ListItem from '../../components/Includes/Gallery/ListItem';

class MyList extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			dropdown_open: false
		};
	}

	toggleDropdown() {
		this.setState({ dropdown_open: !this.state.dropdown_open });
	}

	componentDidMount() {
	}

	render() {
		return (
			<Layout title="My List">
				<NavBack title="My List" />
				<div className="wrapper-content container-box-ml" style={{ marginTop: 50 }}>
					<div className="header-list">
						<p className="header-subtitle">My List</p>
						<ButtonDropdown isOpen={this.state.dropdown_open} toggle={this.toggleDropdown.bind(this)}>
							<DropdownToggle caret>
								Latest Post
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>Latest Post</DropdownItem>
								<DropdownItem>A-Z</DropdownItem>
							</DropdownMenu>
						</ButtonDropdown>
					</div>
					<ListItem 
						striped
						imageSrc="https://static.rctiplus.id/media/620/files/fta_rcti/Landscape/rsi___2000_x_1152.jpg"
						title="Rising Star Indonesia"
						subtitle="2 video"/>
				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {
	...bookmarkActions
})(MyList);
