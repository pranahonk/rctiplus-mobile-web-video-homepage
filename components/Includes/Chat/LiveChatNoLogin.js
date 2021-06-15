import React from 'react'
import Router from 'next/router';

export default function LiveChat_NoLogin({toggleChat}) {
    return (
        <div className="container-nologin">
            <div className="title-nologin">Please Log In</div>
            <p>Anda harus log in terdahulu <br/> sebelum menggunakan fitur live chat</p>
            <button onClick={() => {Router.push('/login'); toggleChat()}}>Log In / Register</button>
        </div>
    )
}
