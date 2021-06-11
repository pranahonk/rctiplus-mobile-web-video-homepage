import { useState} from "react"
import { Row, Col, Button, Input } from 'reactstrap';
import { Picker } from 'emoji-mart';
import { ChevronDownIcon} from "../../../components/IconComponents"
import SentimenVerySatifiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import '../../../assets/scss/components/tv-v2.scss';
import 'emoji-mart/css/emoji-mart.css';

const Chat = ({...props}) => {
	const inputChatBoxRef = React.createRef();
	
	const [chat, setChat] = useState("");
  	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  	const handleToggelEmoji = () => setEmojiPickerOpen(!emojiPickerOpen);
	const onSelectEmoji = (emoji) => setChat(chat+emoji.native);
	
	const loadChatMessages = () =>{};
	const sendChat = () => {};

  return(
    <div className="box-chat" >
      <div onClick={props.toggle} className="chat-wrapper" style={{borderRadius:"0px", padding: "15px"}}>
        <ChevronDownIcon />
          <label className="chat-text">
            Live Chat
            <span className="circle-chat" style={{background:"#6DD400"}} />
          </label>
      </div>

      <div  className="chat-messages" id="chat-messages">
        <Row  className="chat-line">
			<Col xs={2}> 
            	Img  
				{/* <Img
					loader={<PersonOutlineIcon className="chat-avatar" />}
					unloader={<PersonOutlineIcon className="chat-avatar" />}
					className="chat-avatar" src={[chat.i, '/static/icons/person-outline.png']} /> */}
			</Col>
			<Col className="chat-message" xs={10}> 
            This chat 
				{/* {chat.sent != undefined && chat.failed != undefined ? (chat.sent == true && chat.failed == true ? (<span onClick={() => this.resendChat(i)}><RefreshIcon className="message" /> <small style={{ marginRight: 10, fontSize: 8, color: 'red' }}>failed</small></span>) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)) : (<TimeAgo className="timeago" minPeriod={60} date={Date.now() - (Date.now() - chat.ts)} />)} <span className="username">{chat.u}</span> <span className="message">{chat.m}</span> */}
			</Col>
		</Row>
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
							// onKeyDown={this.handleChatEnter.bind(this)}
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
						<Button className="send-button" >
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
  )
}

export default Chat