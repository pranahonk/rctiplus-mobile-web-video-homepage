import Router from 'next/router';
import ax from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE, USER, WRONG_AUTHENTICATION } from '../types';
import { API, VISITOR_TOKEN } from '../../config';
import { setCookie, removeCookie } from '../../utils/cookie';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const test = () => {
    return dispatch => {
        axios.get('/v1/test-get-otp')
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };
};

const login = ({ emailphone, password }) => {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('/v1/login', {
                emailphone: emailphone,
                password: password,
                device_id: 'test',
                platform: 'web'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const data = response.data;
                if (data.status.code == 0) {
                    dispatch({ type: AUTHENTICATE, data: data, token: data.data.access_token });
                }
                else {
                    dispatch({ type: WRONG_AUTHENTICATION, message: data.status.message_client, code: data.status.code });
                }
                resolve(response);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
};

// register user
const register = ({ firstname, lastname, mobile_no, email_id, password, confirm_password }, type) => {
    if (type !== 'register') {
        throw new Error('Wrong API call!');
    }

    return dispatch => {
        axios.post(`${API}/${type}`, { firstname, lastname, mobile_no, email_id, password, confirm_password })
            .then(response => {
                Router.push('/signin');
                console.log(response.data.meta.message);
            })
            .catch(error => {
                switch (error.response.status) {
                    case 422:
                        alert(error.response.data.meta.message);
                        break;
                    case 401:
                        alert(error.response.data.meta.message);
                        break;
                    case 500:
                        alert('Interval server error! Try again!');
                        break;
                    default:
                        alert(error.response.data.meta.message);
                        break;
                }
            });
    };
};

const authenticate = ({ email_id, password }, type) => {
    if (type !== 'login') {
        throw new Error('Wrong API call!');
    }

    return dispatch => {
        console.log(email_id);
        axios.post(`${API}/api/${type}`, { email_id, password })
            .then(response => {
                console.log(response);
                const token = response.data.token;
                console.log(token);
                setCookie('token', token);
                Router.push('/users');
                dispatch({ type: AUTHENTICATE, payload: token });
            })
            .catch(error => {
                console.log(error);
                switch (error.response.status) {
                    case 422:
                        alert(error.response.data.meta.message);
                        break;
                    case 401:
                        alert(error.response.data.meta.message);
                        break;
                    case 500:
                        alert('Interval server error! Try again!');
                        break;
                    default:
                        alert(error.response.data.meta.message);
                        break;
                }
            });
    };
};

const reauthenticate = token => {
    return dispatch => {
        dispatch({ type: AUTHENTICATE, payload: token });
    };
};

const deauthenticate = () => {
    return dispatch => {
        removeCookie('token');
        Router.push('/');
        dispatch({ type: DEAUTHENTICATE });
    };
};

const getUser = ({ token }, type) => {
    console.log(token);
    return dispatch => {
        axios.get(`${API}/${type}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => {
                dispatch({ type: USER, payload: response.data.data.user });
            })
            .catch(error => {
                switch (error.response.status) {
                    case 401:
                        Router.push('/');
                        break;
                    case 422:
                        alert(error.response.data.meta.message);
                        break;
                    case 500:
                        alert('Interval server error! Try again!');
                    case 503:
                        alert(error.response.data.meta.message);
                        Router.push('/');
                        break;
                    default:
                        alert(error.response.data.meta.message);
                        break;
                }
            });
    };
};

export default {
    register,
    authenticate,
    deauthenticate,
    reauthenticate,
    getUser,
    test,
    login
};