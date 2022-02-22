import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';
// import Stories from 'react-insta-stories'
import '../../assets/scss/components/stories.scss';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import contentActions from '../../redux/actions/contentActions';
import TextLength from "../../utils/textLength";
import { RESOLUTION_IMG } from '../../config';
class Pnl_5 extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id: this.props.contentId,
			contents: this.props.content,
			loading: false,
			page: 1,
			length: 7,
			endpage: false,
			showInsta: false,
			storiesActive: []
		};

		this.swipe = {};
	}

	handleClickHere(data){
		switch (data.swipe_type) {
			case 'live_streaming' :
				let channel = 'rcti'
				if(data.swipe_value === '1') {
					channel = 'rcti'
				}
				if(data.swipe_value === '2') {
					channel = 'mnctv'
				}
				if(data.swipe_value === '3') {
					channel = 'gtv'
				}
				if(data.swipe_value === '4') {
					channel = 'inews'
				}
				Router.push(`/tv/${channel}`);
				break;
			case 'news_detail' :
			case 'news_tags' :
			case 'news_category':
			case 'deeplink':
			case 'link':
				window.open(data.swipe_value, '_parent');
				break;
			case 'homepage_news':
				Router.push("/news")
				break;
			case 'scan_qr':
				Router.push("/qrcode")
			case 'extra':
			case 'clips':
			case 'episode':
				window.open(data.share_link, '_parent');
				break;
			case 'program':
				Router.push(`/programs/${data.swipe_value}/${data.title.replace(/ +/g, '-')}`);
				break;
			case 'catchup':
				if(data.swipe_value && data.channel && data.catchup_date) {
					const title = data?.title?.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')
					Router.push(`/tv/${data.channel}/${data.swipe_value}/${title}?date=${data.catchup_date}`)
				}
				break;
			case 'live_event':
				if (data.swipe_value) {
					Router.push(`/live-event/${data.swipe_value}/${data.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')}`);
				}
				break;
			default:
				break;
		}
	}

	loadMore() {
		if (!this.state.loading && !this.state.endpage) {
			const page = this.state.page + 1;
			this.setState({ loading: true }, () => {
				this.props.loadingBar && this.props.loadingBar.continuousStart();
				this.props.getStoryLineup(this.state.id, page, this.state.length)
					.then(response => {
						if (response.status === 200 && response.data.status.code === 0) {
							console.log(`ini response`,response.data.data)
							const contents = this.state.contents;
							contents.push.apply(contents, response.data.data);
							this.setState({ loading: false, contents: contents, page: page, endpage: response.data.data.length < this.state.length });
						}
						else {
							this.setState({ loading: false });
						}
						this.props.loadingBar && this.props.loadingBar.complete();
					})
					.catch(error => {
						console.log(error);
						this.setState({ loading: false, endpage: true })
						this.props.loadingBar && this.props.loadingBar.complete();
					});
			});
		}
	}

	seeMoreFactory = (data) => {
		return ({close}) => {
		  	close()
			this.handleClickHere(data)
		  	return null
		}
	}

	handleSetStories(story, profile){
		let _tempStory = []
		story.forEach(element => {
			if(element.swipe_type === "default"){
				_tempStory.push(
					{
					url: element.link_video !== null ? element.link_video : `${this.props.imagePath}${RESOLUTION_IMG}${element.story_img}`,
					type: element.link_video !== null ? 'video' : '',
					header: {
						heading: element.title,
						profileImage: `${this.props.imagePath}150${profile}`
					}
				}
				)
			}else{
				_tempStory.push(
					{
					url: element.link_video !== null ? element.link_video : `${this.props.imagePath}${RESOLUTION_IMG}${element.story_img}`,
					type: element.link_video !== null ? 'video' : '',
					header: {
						heading: element.title,
						profileImage: `${this.props.imagePath}150${profile}`
					},	
					seeMore: this.seeMoreFactory(element)
				}
				)
			}
			
		});

		this.setState({storiesActive: _tempStory})
	}

	render() {
		return (
			<>
				{/* Modal story lineup */}
				{this.state.showInsta && 
					<div className="modal-stories">
						<div onClick={()=> this.setState({showInsta: false})} style={{position:"fixed", right: 25, top: 25, zIndex: 2000000, color:"white"}}><CloseRoundedIcon /></div>
						{/* <Stories
							stories={this.state.storiesActive}
							defaultInterval={7000}
							width="100%"
							height="100%"
							onAllStoriesEnd= {() => this.setState({showInsta:false})}
							keyboardNavigation={true}
						/> */}
					</div>
				}

				<div style={{paddingLeft:"14px"}} className="homepage-content pnl_horizontal">
					<h2 className="content-title">{this.props.title}</h2>
					<BottomScrollListener offset={40} onBottom={this.loadMore.bind(this)}>
						{scrollRef => (
							<div ref={scrollRef} className="contain-circle">
								{this.state.contents && this.state.contents.map((v,i) => (
										<div 
											onClick={() => {
												this.handleSetStories(v.story, v.program_img)
												this.setState({showInsta: !this.state.showInsta})
											}} 
											style={{padding: "10px", background: "#1A1A1A", borderRadius: "5px"}} className="circle-box">
											<div style={{display: "block", textAlign:"center", backgroundColor:"transparent"}} >
												<span  className="cont-circle">
													{v.program_img !== null && <img className="circle-img" src={this.props.imagePath + 150 + v.program_img} />}
												</span>
												<div style={{paddingTop:"4px", height:"40px", fontSize:"12px", fontWeight:300, color:"white", whiteSpace: "normal", overflow:"hidden", textOverflow:"ellipsis"}} >{TextLength(v.program_title, 25)}</div>
											</div>
										</div>
								))}
							</div>
						)}
					</BottomScrollListener>
				</div>
			</>
		);
	}
}

export default connect(state => state, contentActions)(Pnl_5);
