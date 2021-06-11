import React from 'react'
import Router from 'next/router';
import "../../../assets/scss/components/live-chat.scss"

export default function LiveChat_TnC({toggelUnderstand,toggelSkip}) {
    return (
        <div className="container-nologin">
            <div className="title-nologin">Reminder</div>
            <p>Selamat menikmati fitur live chat. Aturan tertulis berlaku 
                <br/>  <span >( <a href="/terms-&-conditions">Terms & Conditions</a> dan <a href="/privacy-policy">Privacy Policy</a>)</span>, jika ada 
                <br/> pelanggaran atau spam, maka anda akan di block secara 
                <br/> otomatis dari pihak RCTI+.
            </p>
            <button onClick={toggelUnderstand} >Understand</button>

            <div onClick={toggelSkip} style={{marginTop: "7px", color:"#05B5F5"}}>Skip</div>
        </div>
    )
}
