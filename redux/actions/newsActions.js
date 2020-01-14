import ax from 'axios';
import { NEWS_API } from '../../config';
import { getCookie, getNewsToken } from '../../utils/cookie';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    baseURL: NEWS_API + '/api',
    headers: {
        'Authorization': accessToken == undefined ? getNewsToken() : accessToken
    }
});

// {
//     "merchantName": "rcti+",
//     "hostToken": "token_core",
//     "platform": "mweb"
// }

export default {};