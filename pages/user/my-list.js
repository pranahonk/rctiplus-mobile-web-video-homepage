import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import Img from 'react-image';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import initialize from '../../utils/initialize';
import { getCookie } from '../../utils/cookie';
import { accountGeneralEvent, accountMylistRelatedProgramClicked } from '../../utils/appier';

import bookmarkActions from '../../redux/actions/bookmarkActions';
import searchActions from '../../redux/actions/searchActions';

//load default layout
import Layout from '../../components/Layouts/Default_v2';

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
			meta_mylist: {},
			meta_related: {},
			resolution: 593,
			recommendations: [],
			current_page: 1,
			length: 10,
			order_by: 'date',
			recommendation_page: 1,
			loading: false,
			endpage: false
		};

		this.swipe = {};
	}

	onTouchStart(e) {
		const touch = e.touches[0];
		this.swipe = { x: touch.clientX };
	}

	onTouchEnd(e) {
		const touch = e.changedTouches[0];
		const absX = Math.abs(touch.clientX - this.swipe.x);
		if (absX > 50) {
            accountGeneralEvent('mweb_account_mylist_related_scroll_horizontal');
        }
	}

	toggleDropdown() {
		this.setState({ dropdown_open: !this.state.dropdown_open }, () => {
			if (this.state.dropdown_open) {
				accountGeneralEvent('mweb_account_mylist_filter_clicked');
			}
		});
	}

	showMore() {
		this.props.getBookmark(this.state.current_page, this.state.length)
			.then(response => {
				const data = response.data.data;
				let mylist = this.state.mylist;
				mylist.push.apply(mylist, mylist);

				this.setState({ mylist: mylist, current_page: this.state.current_page + 1 }, () => {
					this.props.setBookmarkShowMoreAllowed(data.length >= this.state.length);
					this.orderBy(this.state.order_by);
				});
			})
			.catch(error => console.log(error));
	}

	showMoreRecommendation() {
		if (!this.state.loading && !this.state.endpage) {
			accountGeneralEvent('mweb_account_mylist_related_showmore_clicked');
			const page = this.state.recommendation_page + 1;
			this.setState({ loading: true }, () => {
				this.LoadingBar && this.LoadingBar.continuousStart();
				this.props.getRecommendation(page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							const contents = this.state.recommendations;
							contents.push.apply(contents, response.data.data);
							this.setState({ loading: false, recommendations: contents, recommendation_page: page, endpage: response.data.data.length < 10 });
						}
						else {
							this.setState({ loading: false });
						}
						this.LoadingBar && this.LoadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.setState({ loading: false, endpage: true })
						this.LoadingBar && this.LoadingBar.complete();
					});
			});
		}
	}

	orderBy(order, first = false) {
		this.setState({ order_by: order }, () => {
			switch (this.state.order_by) {
				case 'title':
					let mylist = this.state.mylist.slice();
					mylist.sort((a, b) => (a.title > b.title) ? 1 : -1);
					this.setState({ ordered_list: mylist }, () => {
						if (first != true) {
							accountGeneralEvent('mweb_account_mylist_filter_asc_clicked');
						}
					});
					break;

				default:
					this.setState({ ordered_list: this.state.mylist.slice() }, () => {
						if (first != true) {
							accountGeneralEvent('mweb_account_mylist_filter_latest_post_clicked');
						}
					});
					break;
			}
		});
	}

	componentDidMount() {
		const token = getCookie('ACCESS_TOKEN');
		if (token == undefined) {
			Router.push('/login');
		}
		
		this.props.getBookmark(this.state.current_page, this.state.length)
			.then(response => {
				const data = response.data.data;
				const meta = response.data.meta;
				this.setState({ mylist: data, ordered_list: data, meta_mylist: meta, current_page: 2 }, () => {
					this.props.setBookmarkShowMoreAllowed(data.length >= this.state.length);
				});
			})
			.catch(error => console.log(error));

		this.props.getRecommendation(this.state.recommendation_page, this.state.length)
			.then(response => {
				this.setState({ recommendations: response.data.data, recommendation_page: this.state.recommendation_page + 1, meta_related: response.data.meta });
			})
			.catch(error => console.log(error));
	}

	linkRelated(rp) {
		accountMylistRelatedProgramClicked(rp.id, rp.title, rp.content_title, rp.content_type, rp.content_id, 'mweb_account_mylist_related_program_clicked');
		Router.push(`/programs/${rp.id}/${rp.title.replace(/ +/g, '-').toLowerCase()}?ref=mylist`);
	} 

	linkProgram(l) {
		accountGeneralEvent('mweb_account_mylist_program_clicked');
		Router.push(`/programs/${l.program_id}/${l.title.replace(/ +/g, '-').toLowerCase()}?ref=mylist`);
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
				<LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)}/>
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
							imageSrc={this.state.meta_mylist.image_path + (this.props.resolution ? this.props.resolution : this.state.resolution) + l.image}
							title={l.title}
							link={() => this.linkProgram(l)}
							subtitle={l.total_content + ' video'} />)}

					{showMoreButton}

					<div className="related-box">
						<div className="related-menu" onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}>
							<p className="related-title"><strong>Related</strong></p>
							<BottomScrollListener offset={40} onBottom={this.showMoreRecommendation.bind(this)}>
								{scrollRef => (
									<div ref={scrollRef} className="related-slider">
										{this.state.recommendations.map(rp => (
											<div onClick={() => this.linkRelated(rp)} key={rp.id} className="related-slide">
												<Img alt={rp.title} src={[this.state.meta_related.image_path + '140' + rp.portrait_image, '/static/placeholders/placeholder_potrait.png']} className="related-program-thumbnail" />
											</div>
										))}
									</div>
								)}
							</BottomScrollListener>

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
