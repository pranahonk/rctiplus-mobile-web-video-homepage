import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import nextCookie from 'next-cookies'
import { Row, Col, Button, Input } from 'reactstrap';
import { Picker } from 'emoji-mart';
import Img from 'react-image';
import TimeAgo from 'react-timeago';

import { ChevronDownIcon} from "../../../components/IconComponents"
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import pageActions from '../../../redux/actions/pageActions';
import chatsActions from '../../../redux/actions/chats';
import userActions from '../../../redux/actions/userActions';

import { showSignInAlert } from '../../../utils/helpers';

import '../../../assets/scss/components/tv-v2.scss';
import 'emoji-mart/css/emoji-mart.css';

class Chat extends React.Component {

    constructor(props) {
	    super(props);
        this.inputChatBoxRef = React.createRef();
        this.state={
            emojiPickerOpen: false, 
            chat: "",
            user_data: null,
			sending_chat: false,
			chats: [],
			total_newChat: []
        }
	}

    componentDidMount() {
		this.loadChatMessages(this.props.id)
        this.props.getUserData()
			.then(response => {
				console.log(response);
				if (response.status === 200 && response.data.status.code === 0) {
					this.setState({ user_data: response.data.data });
				}
			})
			.catch(error => {
				console.log(error);
		});
    }

    handleToggelEmoji(){
        this.setState({emojiPickerOpen: !this.state.emojiPickerOpen})
    }

    onSelectEmoji(emoji) {
		this.setState({ chat: this.state.chat + emoji.native });
	}

	onChangeChatInput(e) {
		if (e.target.value != '\n') {
			this.setState({ chat: e.target.value });
		}
	}

	handleChatEnter(e) {
		const chatInput = document.getElementById('chat-input');
		const scrollHeight = chatInput.scrollHeight - 30;
		chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && this.state.chat && this.state.chat != '\n') {
			this.sendChat();
		}
	}

	handleScroll() {
		const chatBox = document.getElementById('box-chat');
		if((chatBox.scrollHeight - chatBox.scrollTop) - chatBox.clientHeight <= 25){
			this.setState({ chat_box: false, total_newChat: []})
		}
		else{
			this.setState({ chat_box: true})	
		}
	}

	handleScrollToBottom  () {
		const chatBox = document.getElementById('box-chat');
		chatBox.scrollTop = chatBox.scrollHeight;
		
		this.setState({chat_box: false, total_newChat: []})
	}

    loadChatMessages(id) {
		this.setState({ chats: [] }, () => {
			const chatBox = document.getElementById('box-chat');
			chatBox.scrollTop = chatBox.scrollHeight;
				let firstLoadChat = true;
				this.props.listenChatMessages(id)
					.then(collection => {
						let snapshots = this.state.snapshots;
						let snapshot = collection.orderBy('ts', 'desc').limit(10).onSnapshot(querySnapshot => {
							querySnapshot.docChanges()
								.map(change => {
									let chats = this.state.chats;
									if (change.type === 'added') {
										if (!this.state.sending_chat) {
											if (chats.length > 0) {
												let lastChat = chats
												let newChat = change.doc.data();
												
												if ((lastChat && newChat) && (lastChat.u != newChat.u || lastChat.m != newChat.m || lastChat.i != newChat.i)) {
													if (firstLoadChat) {
														chats.unshift(newChat);
													}
													else {
														chats.push(newChat);
														this.state.total_newChat.push(newChat)
													}
												}
											}
											else {
												if (firstLoadChat) {
													chats.unshift(change.doc.data());	
												}
												else {
													chats.push(change.doc.data());
													this.state.total_newChat.push(change.doc.data())
												}
											}
										
											this.setState({ chats: chats }, () => {
												const chatBox = document.getElementById('box-chat');
												chatBox.scrollTop = chatBox.scrollHeight;
												
												const chatInput = document.getElementById('chat-input');
												chatInput.style.height = `24px`;
											});
										}
									}
								});

							firstLoadChat = false;
						});
					});
		});
	}

    sendChat() {
		if (this.state.user_data) {
			if (this.state.chat != '') {
				// this.statusChatBlock(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id);
				const userData = this.state.user_data;
				let user = userData.nickname ? userData.nickname :
					userData.display_name ? userData.display_name :
						userData.email ? userData.email.replace(/\d{4}$/, '****') :
							userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
				let newChat = {
					ts: Date.now(),
					m: this.state.chat,
					u: user,
					i: this.state.user_data.photo_url,
					sent: false,
					failed: false
				};
				let chats = this.state.chats;
				// chats.push(newChat);

				this.setState({ chats: chats, chat: '', sending_chat: true }, () => {
					
					const chatInput = document.getElementById('chat-input');
					chatInput.style.height = `24px`;

					this.props.setChat(this.props.id, newChat.m, user, this.state.user_data.photo_url)
						.then(response => {
							newChat.sent = true;
							if (response.status !== 200 || response.data.status.code !== 0) {
								newChat.failed = true;
							}
							chats[chats.length] = newChat;
							this.setState({ chats: chats, sending_chat: false },
							() => {
								const chatBox = document.getElementById('box-chat');
								chatBox.scrollTop = chatBox.scrollHeight;
							});
						})
						.catch(() => {
							newChat.sent = true;
							newChat.failed = true;
							// chats[chats.length] = newChat;
							// this.setState({ chats: chats, sending_chat: false });
						});
				});
			}
		}
		else {
			showSignInAlert(`Please <b>Sign In</b><br/>
			Woops! Gonna sign in first!<br/>
			Only a click away and you<br/>
			can continue to enjoy<br/>
			<b>RCTI+</b>`, '', () => { }, true, 'Sign Up', 'Sign In', true, true);
		}
	}

	resendChat(index) {
		let chats = this.state.chats;
		let lastChat = chats[index];
		lastChat.sent = false;
		lastChat.failed = false;
		chats[index] = lastChat;
		this.setState({ chats: chats, sending_chat: true }, () => {
			const userData = this.state.user_data;
			let user = userData.nickname ? userData.nickname :
				userData.display_name ? userData.display_name :
					userData.email ? userData.email.replace(/\d{4}$/, '****') :
						userData.phone_number ? userData.phone_number.substring(0, userData.phone_number.lastIndexOf("@")) : 'anonymous';
			this.props.setChat(this.state.live_events[this.state.selected_index].id ? this.state.live_events[this.state.selected_index].id : this.state.live_events[this.state.selected_index].content_id, lastChat.m, user, this.state.user_data.photo_url)
				.then(response => {
					lastChat.sent = true;
					if (response.status !== 200 || response.data.status.code !== 0) {
						lastChat.failed = true;
					}
					chats[index] = lastChat;
					this.setState({ chats: chats, sending_chat: false });
				})
				.catch(() => {
					lastChat.sent = true;
					lastChat.failed = true;
					chats[index] = lastChat;
					this.setState({ chats: chats, sending_chat: false });
				});
		});
	}

    render(){
        return(
			<Fragment>
				<div onClick={this.props.toggle} className="chat-wrapper" style={{borderRadius:"0px", padding: "15px"}}>
                    <ChevronDownIcon />
                    <label className="chat-text">
                        Live Chat
                        <span className="circle-chat" style={{background:"#6DD400"}} />
                    </label>
                </div>
				
				<div className="box-chat" id={"box-chat"} >
					<div  className="chat-messages" id="chat-messages">
						{this.state.chats.map((chat, i) => (
								<Row key={i} className="chat-line">
									<Col xs={2}>
										<Img
											loader={<PersonOutlineIcon className="chat-avatar" />}
											unloader={<PersonOutlineIcon className="chat-avatar" />}
											className="chat-avatar" src={[chat.i, '/static/icons/person-outline.png']} />
									</Col>
									<Col className="chat-message" xs={10}>
										{chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span>
									</Col>
								</Row>
						))}
					</div>

                	<div className="chat-input-box">
                        <div ref={this.inputChatBoxRef} className="chat-box">
                            <Row>
                                <Col xs={1}>
                                    <Button className="emoji-button">
                                        {this.state.emojiPickerOpen ? (<KeyboardIcon onClick={this.handleToggelEmoji.bind(this)} />) : (<SentimenVerySatifiedIcon onClick={this.handleToggelEmoji.bind(this)} />)}
                                    </Button>
                                </Col>
                                <Col xs={9}>
                                    <Input
                                       	onKeyDown={this.handleChatEnter.bind(this)}
									   	onChange={this.onChangeChatInput.bind(this)}
                                        // onClick={this.checkLogin.bind(this)}
                                        value={this.state.chat}
                                        type="textarea"
                                        id="chat-input"
                                        placeholder="Start Chatting"
                                        className="chat-input"
                                        maxLength={250}
                                        rows={1} 
                                    />
                                </Col>
                                <Col xs={1}>
                                    <Button className="send-button" onClick={this.sendChat.bind(this)} >
                                        <SendIcon />
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                        <Picker
                            onSelect={emoji => {
                                this.onSelectEmoji(emoji);
                            }}
                            showPreview={false}
                            darkMode
                            style={{ display: this.state.emojiPickerOpen ? 'block' : 'none' }} 
                        />			
                    </div>
            </div>
			</Fragment>
        )
    }

}

export default connect(state => state, {
	...liveAndChatActions,
	...pageActions,
	...chatsActions,
	...userActions
})(withRouter(Chat));