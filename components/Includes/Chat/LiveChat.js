import { useState } from "react"
import { Row, Col, Button, Input } from 'reactstrap';
import { ChevronDownIcon} from "../../../components/IconComponents"

import '../../../assets/scss/components/tv-v2.scss';

const Chat = ({...props}) => {
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

    </div>
  )
}

export default Chat