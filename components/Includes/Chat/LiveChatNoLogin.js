import React from 'react'
import Router from 'next/router';
import "../../../assets/scss/components/live-chat.scss"

export default function LiveChat_NoLogin({toggleChat, channelMain}) {
    return (
        <div className="container-nologin">
            <div className="title-nologin">Please Log In</div>
            <p>Anda harus log in terdahulu <br/> sebelum menggunakan fitur live chat</p>
            <button onClick={() => {Router.push(`/login?referrer=/tv/${channelMain}`);}}>Log In / Register</button>
        </div>
    )
}
						