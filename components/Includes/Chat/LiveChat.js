import { useState, useEffect, Fragment } from "react"
import { connect } from "react-redux"
import { Row, Col, Button, Input } from 'reactstrap';
import { Picker } from 'emoji-mart';
import { withRouter } from 'next/router';
import Img from 'react-image';
import TimeAgo from 'react-timeago';

import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ChevronDownIcon} from "../../../components/IconComponents"
import NoLogin from "./LiveChatNoLogin";
import LiveChatTnc from "./LiveChatTnC"

import '../../../assets/scss/components/tv-v2.scss';
import 'emoji-mart/css/emoji-mart.css';
import ax from 'axios';

import chatsActions from '../../../redux/actions/chats';
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
	const [totalNewChat, setTotalNewChat] = useState([]);
	const [userData, setUserData] = useState(null);
	const [isStatusTnC, setIsStatusTnC] = useState(true);
	const [showTnC, setShowTnC] = useState(false);
  	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
	const [sendingChat, setSendingChat] = useState(false);
	const [btnToBottom, setBtnToBottom] = useState(false);
	const [isLoading, setIsloading] = useState(false);
	const [totalUnread, setTotalUnread] = useState(0);

  	const handleToggelEmoji = () => setEmojiPickerOpen(!emojiPickerOpen);
	const onSelectEmoji = (emoji) => setChat(chat+emoji.native);

	const getUser = () => {
		setIsloading(true)
		axios.get('/v3/user')
		.then(response => {
		  	if (response.data.data) {
				setUserData(response.data.data);
				setIsloading(false);
			}
		})
		.catch(error => setIsloading(false)
		);
	}

	const handleChatEnter = (e) =>{
		const chatInput = document.getElementById('chat-input');
		chatInput.style.height = `24px`;

		// const chatInput = document.getElementById('chat-input');
		// const scrollHeight = chatInput.scrollHeight - 30;
		// chatInput.style.height = `${24 + (24 * (scrollHeight / 24))}px`;

		if (e.key === 'Enter' && !e.shiftKey && chat && chat != '\n') {
			handleScrollToBottom();
			sendChat(props.id);
		};
	}
	
	const scrollToBottom = () => {
		const chatBox = document.getElementById('box-chat');
		chatBox.scrollTop = chatBox.scrollHeight;
	}

	const handleScrollToBottom = () =>{
		scrollToBottom();
		setBtnToBottom(false);
		setTimeout(() => setTotalUnread(0), 5000)
	}
 
	const handleScroll = () => {
		const chatBox = document.getElementById('box-chat');
		if(((chatBox.scrollHeight - chatBox.scrollTop) - chatBox.clientHeight) <= 25) handleScrollToBottom()
		else setBtnToBottom(true);
	}

	const getStatusTNC = () => {
		if(userData !== null && props.openChat){
			axios.get('/v1/agreement/live-chat/status')
				.then(response => {
					if (response?.data?.data)	setIsStatusTnC(response?.data?.data?.is_signed)
				})
				.catch(error => console.log(error))	
		}
	}
	
	const handleStatusTNC = () => {
		axios.get('/v1/agreement/live-chat/sign')
			.then(response => {
				if (response?.data?.data) setShowTnC(false);
			})
			.catch(error => console.log(error));
	}

	useEffect(() => {
		if (chats.length > 10 && btnToBottom) setTotalUnread(totalUnread + 1)
	}, [chats.length])
	
	function loadChatMessages (id) {
		let firstLoadChat = true;
		let totalTemp = totalNewChat
		let chatsTemp = chats;
		
		props.listenChatMessages(id)
			.then(collection => {
				let snapshot = collection.orderBy('ts', 'desc').limit(10).onSnapshot(querySnapshot => {
				
				querySnapshot.docChanges()
					.map(change => {
						if (change.type === 'added') {
							if (chatsTemp.length > 0) {
								let newChat = change.doc.data();
								if (firstLoadChat) chatsTemp.unshift(newChat);
								else {
									chatsTemp.push(newChat);
									totalTemp.push(newChat);
								}
							}
							else {
								if (firstLoadChat) chatsTemp.unshift(change.doc.data());
								else {
									chatsTemp.push(change.doc.data());
									totalTemp.push(change.doc.data())
								}
							}

							setChats([...chatsTemp]);
							setTotalNewChat([...totalTemp])
							if(firstLoadChat) handleScrollToBottom();
							if(userData){
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
				setChat("");
				handleScrollToBottom();

				props.setChat(props.id, newChat.m, user, userData.photo_url)
					.then(response => {
						newChat.sent = true;
						if (response.status !== 200 || response.data.status.code !== 0) {
							newChat.failed = true;
						}
						chatsCurrent[chatsCurrent.length] = newChat;
						
						setChats(chatsCurrent);
						setSendingChat(false);
						handleScrollToBottom()
					})
					.catch(() => {
						newChat.sent = true;
						newChat.failed = true;
					});
			}
		}
	};

	useEffect(() =>{
		initGA();
		getUser();
	}, [])

	useEffect(() => {
		if(!isStatusTnC) setTimeout(() =>  setShowTnC(true), 10000)
	}, [isStatusTnC])

	useEffect(() =>	loadChatMessages(props.id), [props.id]);
	useEffect(() => getStatusTNC(), [userData]);

	console.log(`ini show tnc`, showTnC)

  	return(
		<Fragment>
			<div onClick={props.toggle} className="chat-wrapper" style={{borderRadius:"0px", padding: "15px"}}>
				<ChevronDownIcon />
				<label className="chat-text">
					Live Chat
					<span className="circle-chat" style={{background:"#6DD400"}} />
				</label>
			</div>
 
			<div onScroll={handleScroll} className="box-chat" id="box-chat" >
				{!userData ? <NoLogin toggleChat={props.toggle} channelMain={props.channelMain} /> : 
				<Fragment>
					{showTnC ? <LiveChatTnc toggelUnderstand={handleStatusTNC} toggelSkip={() => setShowTnC(false)} /> : 
					<Fragment>
						<div className="chat-messages" >
								
							{chats.map((val, i) => {
								
								return(
									<Fragment>
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
										{totalUnread > 0 && (chats.length - totalUnread) === i+1  && <div style={{width:"100%", background: "#282828", fontSize: "10px", display:"flex", justifyContent: "center", alignItems:"center", padding:"4px"}} >{totalUnread} Unread Messages</div>}
									</Fragment>
								)
							})}

							{btnToBottom  && totalUnread > 0 && <div onClick={handleScrollToBottom} style={{width: "36px", height: "36px", borderRadius: "50px", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "90px", right: "10px"}}> {totalUnread} </div>}
							{btnToBottom && <div onClick={handleScrollToBottom} style={{width: "36px", height: "36px", borderRadius: "50px", background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "50px", right: "10px"}}> <ExpandMoreIcon /> </div>}
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
								onSelect={emoji => onSelectEmoji(emoji)}
								showPreview={false}
								darkMode
								style={{ display: emojiPickerOpen ? 'block' : 'none' }} 
							/>			
						</div>
					</Fragment>
					}
				</Fragment>
				}
			</div>
		</Fragment>
  	)
}

export default connect(state => state, {
	...chatsActions,
})(withRouter(Chat));