import firebaseApp from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

if (!firebaseApp.apps.length) {
    // const configFirebase = JSON.stringify({
    //     apiKey: process.env.FIREBASE_apiKey,
    //     authDomain: process.env.FIREBASE_authDomain,
    //     databaseURL: process.env.FIREBASE_databaseURL,
    //     projectId: process.env.FIREBASE_projectId,
    //     storageBucket: process.env.FIREBASE_storageBucket,
    //     messagingSenderId: process.env.FIREBASE_messagingSenderId,
    //     appId: process.env.FIREBASE_appId,
    // });
    const configFirebase = JSON.stringify({
        apiKey: "AIzaSyCFY5ljEzA9bz1jHZ4RTnay1KKE7ysa5Zk",
        authDomain: "rcti-766db.firebaseapp.com",
        databaseURL: "https://rcti-766db.firebaseio.com",
        projectId: "rcti-766db",
        storageBucket: "rcti-766db.appspot.com",
        messagingSenderId: "102225357690",
        appId: "1:102225357690:web:e90f10ab54a010c2",
        measurementId: "G-JR2L0ZYPG7"
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

const getChatMessages = (id, limit = 10) => {
    return dispatch => new Promise((resolve, reject) => {
        let db = firebaseApp.firestore();
        db.collection('statusChat')
            .limit(limit)
            .onSnapshot(querySnapshot => {
            let messages = [];
            querySnapshot.forEach(doc => {
                if (doc.id == id && doc.data().isActive) {
                    db.collection(`chat${id}`)
                        .orderBy('ts', 'asc')
                        .onSnapshot(qs => {
                            qs.forEach(d => {
                                messages.push(d.data());
                            });
                        });
                }
            });
            resolve(messages);
        });

        // db.collection(`chat${id}`)
        //     .limit(limit)
        //     .orderBy('ts', 'asc')
        //     .get()
        //     .then(querySnapshot => {
        //         let messages = [];
        //         querySnapshot.forEach(doc => {  
        //             messages.push(doc.data());
        //         });
        //         resolve(messages);
        //     })
        //     .catch(error => {
        //         reject(error);
        //     });
    });
    
    
};

const listenChatStatus = id => {
    

    return dispatch => new Promise((resolve, reject) => {
        let db = firebaseApp.firestore();
        db.collection(`chat${id}`)
            .limit(10)
            .orderBy('ts', 'desc')
            .get()
            .then(querySnapshot => {
                let messages = [];
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    messages.push(doc.data());
                });
                resolve(messages);
            });
    });
};

export default {
    listenChatStatus,
    listenChat,
    setChat,
    getChatMessages
};