import Router from 'next/router';
import { getCookie, removeCookie } from '../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';

const checkLoggedIn = () => {
    const token = getCookie(tokenKey);
    
};

export default {
    checkLoggedIn
};