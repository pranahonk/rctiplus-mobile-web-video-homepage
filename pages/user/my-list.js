import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import Lazyload from 'react-lazyload';
import { Carousel } from 'react-responsive-carousel';
import Img from 'react-image';
import initialize from '../../utils/initialize';
import bookmarkActions from '../../redux/actions/bookmarkActions';
import searchActions from '../../redux/actions/searchActions';

//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavBack';

import '../../assets/scss/components/my-list.scss';

import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ListItem from '../../components/Includes/Gallery/ListItem';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class MyList extends React.Component {

	static getInitialProps(ctx) {
		initialize(ctx);
	}

	constructor(props) {
		super(props);
		this.state = {
			dropdown_open: false,
			mylist: [],
			ordered_list: [],
			meta: {},
			resolution: 593,
			recommendations: [],
			current_page: 1,
			length: 10,
			order_by: 'date'
		};
	}

	toggleDropdown() {
		this.setState({ dropdown_open: !this.state.dropdown_open });
	}

	showMore() {
        this.props.getBookmark(this.state.current_page, this.state.length)
			.then(response => {
				const data = response.data.data;
				let mylist = this.state.mylist;
				mylist.push.apply(mylist, mylist);

				this.setState({ mylist: mylist, current_page: this.state.current_page + 1 }, () => {
					this.props.setBookmarkShowMoreAllowed(data.length >= this.state.length );
					this.orderBy(this.state.order_by);
				});
			})
			.catch(error => console.log(error));
	}
	
	orderBy(order) {
		this.setState({ order_by: order }, () => {
			switch (this.state.order_by) {
				case 'title':
					let mylist = this.state.mylist;
					mylist.sort((a, b) => (a.title > b.title) ? 1 : -1);
					this.setState({ ordered_list: mylist });
					break;

				default:
					this.setState({ ordered_list: this.state.mylist });
					break;
			}
		});
	}

	componentDidMount() {
		this.props.getBookmark(this.state.current_page, this.state.length)
			.then(response => {
				const data = response.data.data;
				const meta = response.data.meta;
				this.setState({ mylist: data, ordered_list: data, meta: meta, current_page: 2 }, () => {
					this.props.setBookmarkShowMoreAllowed(data.length >= this.state.length );
				});
			})
			.catch(error => console.log(error));

		this.props.getRecommendation()
			.then(response => {
				this.setState({ recommendations: response.data.data });
			})
			.catch(error => console.log(error));
	}

	render() {
		let showMoreButton = '';
        if (this.props.bookmarks.show_more_allowed) {
            showMoreButton = (<div className="list-footer" style={{ margin: 10 }}>
                                <Button onClick={this.showMore.bind(this)} size="xs" className="show-more-button">
                                    <ExpandMoreIcon /> Show More
                                </Button>
                            </div>);
        }

		return (
			<Layout title="My List">
				<NavBack title="My List" />
				<div className="wrapper-content container-box-ml" style={{ marginTop: 50 }}>
					<div className="header-list">
						<p className="header-subtitle">My List</p>
						<ButtonDropdown isOpen={this.state.dropdown_open} toggle={this.toggleDropdown.bind(this)}>
							<DropdownToggle caret>
								{this.state.order_by == 'date' ? 'Latest Post' : 'A-Z'}
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={this.orderBy.bind(this, 'date')} className={this.state.order_by == 'date' ? 'active' : ''}>Latest Post</DropdownItem>
								<DropdownItem onClick={this.orderBy.bind(this, 'title')} className={this.state.order_by == 'title' ? 'active' : ''}>A-Z</DropdownItem>
							</DropdownMenu>
						</ButtonDropdown>
					</div>
					{this.state.ordered_list.map((l, i) =>
						<ListItem
							key={i}
							striped={!(i % 2)}
							imageSrc={this.state.meta.image_path + (this.props.resolution ? this.props.resolution : this.state.resolution) + l.image}
							title={l.title}
							subtitle={l.total_content + ' video'} />)}
					
					{showMoreButton}

					<div className="related-box">
						<div className="related-menu">
							<p className="related-title-ml">Related</p>
							<div className="related-slider">
								<Carousel
									id="detail-carousel"
									showThumbs={false}
									showIndicators={false}
									stopOnHover={true}
									showArrows={false}
									showStatus={false}
									swipeScrollTolerance={1}
									onClickItem={(index) => {
										Router.push('/detail/program/' + this.state.recommendations[index].id);
									}}
									swipeable={true}>
									{this.state.recommendations.map(rp => (
										<Lazyload key={rp.id} height={100}>
											<Img alt={rp.title} src={[this.state.meta.image_path + '140' + rp.portrait_image, '/static/placeholders/placeholder_potrait.png']} className="related-program-thumbnail" />
										</Lazyload>
									))}
								</Carousel>
							</div>
						</div>
					</div>

				</div>
			</Layout>
		);
	}

}

export default connect(state => state, {
	...bookmarkActions,
	...searchActions
})(MyList);
