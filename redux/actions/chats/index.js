import firebaseApp from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

if (!firebaseApp.apps.length) {
    const configFirebase = JSON.stringify({
        apiKey: "AIzaSyBlv2LSoUdLUr0fEwOpLIHmuRh8h8xwO4g",
        authDomain: "rcti-rc.firebaseapp.com",
        databaseURL: "https://rcti-rc.firebaseio.com",
        projectId: "rcti-rc",
        storageBucket: "rcti-rc.appspot.com",
        messagingSenderId: "808988495158",
        appId: "1:808988495158:web:11d489c1c5da7b61"
    });
    firebaseApp.initializeApp(JSON.parse(configFirebase));
}

import ax from 'axios';
import { DEV_API } from '../../../config';
import { getCookie, getVisitorToken, checkToken } from '../../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });
axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

/* 
    i: avatar url
    m: message
    ts: timestamp
    u: username
    vid: ?
*/

const listenChat = id => {
    let db = firebaseApp.firestore();
    db.collection(`chat${id}`);
    return dispatch => dispatch({
        type: 'LISTEN_CHAT_STATUS'
    });
};

const setChat = (id, message, username, avatar) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/chat/${id}`, {
                msg: message,
                avatar: avatar,
                user: username
            });

            if (response.status === 200 && response.data.status.code === 0) {
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};

const listenChatStatus = id => {
    let db = firebaseApp.firestore();
    db.collection(`chat${id}`)
        .orderBy('ts', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
            });
        });

    return dispatch => dispatch({
        type: 'LISTEN_CHAT_STATUS'
    });
};

export default {
    listenChatStatus,
    listenChat,
    setChat
};