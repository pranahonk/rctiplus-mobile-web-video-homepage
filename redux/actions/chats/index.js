import firebaseApp from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';
import 'firebase/analytics';

import ax from 'axios';
import { DEV_API, API } from '../../../config';
import { getCookie, getVisitorToken, checkToken } from '../../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });
axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

const initializeFirebase = () => {
    return () => {
        if (!firebaseApp.apps.length) {
            const configFirebase = JSON.stringify({
                apiKey: process.env.FIREBASE_apiKey,
                authDomain: process.env.FIREBASE_authDomain,
                databaseURL: process.env.FIREBASE_databaseURL,
                projectId: process.env.FIREBASE_projectId,
                storageBucket: process.env.FIREBASE_storageBucket,
                messagingSenderId: process.env.FIREBASE_messagingSenderId,
                appId: process.env.FIREBASE_appId,
                measurementId: process.env.FIREBASE_measurementId
            });
            firebaseApp.initializeApp(JSON.parse(configFirebase));
<<<<<<< HEAD
=======
            firebaseApp.analytics();
>>>>>>> 1b94386... fix firebase
        }
    };
};

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

const listenChatMessages = id => {
    return dispatch => new Promise((resolve, reject) => {
        let db = firebaseApp.firestore();
        resolve(db.collection(`chat${id}`));
    });
};

const getChatMessages = id => {
    return dispatch => new Promise((resolve, reject) => {
        let db = firebaseApp.firestore();
        db.collection(`chat${id}`)
            .limit(5)
            .orderBy('ts', 'desc')
            .get()
            .then(querySnapshot => {
                let messages = [];
                querySnapshot.forEach(doc => {
                    messages.push(doc.data());
                });
                resolve(messages);
            });
    });
};

export default {
    initializeFirebase,
    listenChat,
    setChat,
    getChatMessages,
    listenChatMessages
};