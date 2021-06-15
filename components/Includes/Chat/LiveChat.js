import { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Button, Input } from 'reactstrap';
import { Picker } from 'emoji-mart';
import { withRouter } from 'next/router';
import Img from 'react-image';
import TimeAgo from 'react-timeago';

import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ChevronDownIcon} from "../../../components/IconComponents"
import NoLogin from "./LiveChatNoLogin"

import chatsActions from '../../../redux/actions/chats';

import '../../../assets/scss/components/tv-v2.scss';
import 'emoji-mart/css/emoji-mart.css';
import ax from 'axios';

import { initGA } from '../../../utils/firebaseTracking';
import { getCookie, getVisitorToken, checkToken } from '../../../utils/cookie';
import { DEV_API} from '../../../config';
const axios = ax.create({baseURL: DEV_API + '/api'});

axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
  return request;
});

const Chat = ({...props}) => {
	const inputChatBoxRef = React.createRef();

	const [chat, setChat] = useState("");
	const [chats, setChats] = useState([]);
	const [userData, setUserData] = useState(null);
  	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
	const [sendingChat, setSendingChat] = useState(false);

  	const handleToggelEmoji = () => setEmojiPickerOpen(!emojiPickerOpen);
	const onSelectEmoji = (emoji) => setChat(chat+emoji.native);

	const getUser = () =>{
		axios.get('/v3/user')
		.then(response => {
		  if (response.data.data) setUserData(response.data.data)
		})
		.catch(error => console.log(error));
	}

	const handleChatEnter = (e) =>{
		const chatInput = document.getElementById('chat-input');
		const scrollHeight = chatInput.scrollHeight - 30;
		chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && chat && chat != '\n') {
			sendChat(props.id);
		}
	}
	
	const loadChatMessages = (id) => {
		let firstLoadChat = true;
			props.listenChatMessages(id)
				.then(collection => {
					console.log(`berhasil loadmessage`)
					console.log(collection)
					let snapshot = collection.orderBy('ts', 'desc').limit(10).onSnapshot(querySnapshot => {
					querySnapshot.docChanges()
						.map(change => {
							let chatsTemp = chats
							if (change.type === 'added') {
								if (!sendingChat) {
									if (chatsTemp.length > 0) {
										let lastChat = chatsTemp
										let newChat = change.doc.data();
										if ((lastChat && newChat) && (lastChat.u != newChat.u || lastChat.m != newChat.m || lastChat.i != newChat.i)) {
											if (firstLoadChat) chatsTemp.unshift(newChat);
											else {
												chatsTemp.push(newChat);
												// this.state.total_newChat.push(newChat)
											}
										}
									}
									else {
										if (firstLoadChat) chatsTemp.unshift(change.doc.data());	
										else {
											chatsTemp.push(change.doc.data());
											// this.state.total_newChat.push(change.doc.data())
										}
									}

									setChats([...chatsTemp]);
									const chatBox = document.getElementById('box-chat');
									chatBox.scrollTop = chatBox.scrollHeight;
												
									const chatInput = document.getElementById('chat-input');
									chatInput.style.height = `24px`;
								}
							}
							
						});

						firstLoadChat = false;
					});
				});
	};

	const sendChat = (id) => {
		if(userData){
			if(chat !== ""){
				const userCurrent = userData
				let user = userCurrent.nickname ? userCurrent.nickname :
				userCurrent.display_name ? userCurrent.display_name :
				userCurrent.email ? userCurrent.email.replace(/\d{4}$/, '****') :
					userCurrent.phone_number ? userCurrent.phone_number.substring(0, userCurrent.phone_number.lastIndexOf("@")) : 'anonymous';
				let newChat = {
					ts: Date.now(),
					m: chat,
					u: user,
					i: userData.photo_url,
					sent: false,
					failed: false
				};
				let chatsCurrent = chats;
				// chatsCurrent.push(newChat);
				setChat("");

				props.setChat(props.id, newChat.m, user, userData.photo_url)
					.then(response => {
						newChat.sent = true;
						if (response.status !== 200 || response.data.status.code !== 0) {
							newChat.failed = true;
						}
						chatsCurrent[chatsCurrent.length] = newChat;
						
						setChats(chatsCurrent);
						setSendingChat(false);

						const chatBox = document.getElementById('box-chat');
						chatBox.scrollTop = chatBox.scrollHeight;
					})
					.catch(() => {
						newChat.sent = true;
						newChat.failed = true;
						// chats[chats.length] = newChat;
						// this.setState({ chats: chats, sending_chat: false });
					});
			}
		}
	};

	useEffect(() =>{
		initGA();
		getUser();
	}, [])

	useEffect(() => {
		loadChatMessages(props.id)
	}, [props.id])

  	return(
		<>
			<div onClick={props.toggle} className="chat-wrapper" style={{borderRadius:"0px", padding: "15px"}}>
				<ChevronDownIcon />
				<label className="chat-text">
					Live Chat
					<span className="circle-chat" style={{background:"#6DD400"}} />
				</label>
			</div>
 
			<div  className="box-chat" id="box-chat" >
				<div className="chat-messages" >
					{chats.map((val, i) => (
						<Row  className="chat-line">
							<Col xs={2}>   
								<Img
									loader={<PersonOutlineIcon className="chat-avatar" />}
									unloader={<PersonOutlineIcon className="chat-avatar" />}
									className="chat-avatar" src={[val.i, '/static/icons/person-outline.png']} />
							</Col>
							<Col className="chat-message" xs={10}> 
								{val?.sent != undefined && val?.failed != undefined ? (val?.sent == true && val?.failed == true ? (<span><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - val?.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - val?.ts)} />)} 
								&nbsp;<span className="username">{val?.u}</span> <span className="message">{val?.m}</span>
							</Col>
						</Row>
					))}
				</div>

				<div className="chat-input-box">
					<div ref={inputChatBoxRef} className="chat-box">
						<Row>
							<Col xs={1}>
								<Button className="emoji-button">
									{emojiPickerOpen ? (<KeyboardIcon onClick={handleToggelEmoji} />) : (<SentimenVerySatifiedIcon onClick={handleToggelEmoji} />)}
								</Button>
							</Col>
							<Col xs={9}>
								<Input
									onKeyDown={handleChatEnter}
									onChange={e => setChat(e.target.value)}
									// onClick={this.checkLogin.bind(this)}
									value={chat}
									type="textarea"
									id="chat-input"
									placeholder="Start Chatting"
									className="chat-input"
									maxLength={250}
									rows={1} 
								/>
							</Col>
							<Col xs={1}>
								<Button onClick={() => sendChat(props.id)} className="send-button" >
									<SendIcon />
								</Button>
							</Col>
						</Row>
					</div>

					<Picker
						onSelect={emoji => {
							onSelectEmoji(emoji);
						}}
						showPreview={false}
						darkMode
						style={{ display: emojiPickerOpen ? 'block' : 'none' }} 
					/>			
				</div>
			</div>
		</>
  	)
}

export default connect(state => state, {
	...chatsActions,
})(withRouter(Chat));