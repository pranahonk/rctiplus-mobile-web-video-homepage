import ax from 'axios';
import { API, DEV_API, VISITOR_TOKEN } from '../../config';
import { getCookie } from '../../utils/cookie';
import { showConfirmAlert, showSignInAlert } from '../../utils/helpers';

const tokenKey = 'ACCESS_TOKEN';
const accessToken = getCookie(tokenKey);

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': accessToken ? accessToken : VISITOR_TOKEN
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});
const getSubCategory = (info = 'id, name') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/subcategory?info=${info}`);
            let contents = [];
            if (response.data.status.code === 0) {
                const data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    let content = {}
                    if (data[i].api != null) {
                        try {
                            const res = await axios.get(data[i].api);
                            if (res.data.status.code === 0) {
                                content = {
                                    content: res.data.data,
                                    ...data[i]
                                };
                                contents.push(content);
                            }
                            else if (res.data.status.code === 13) {
                                showSignInAlert(`Please <b>Sign In</b><br/>
                                Woops! Gonna sign in first!<br/>
                                Only a click away and you<br/>
                                can continue to enjoy<br/>
                                <b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true);
                            }
                        }
                        catch (e) {
                            // console.log(e);
                        }
                    }
                }
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: response.data.meta });
            }
            else {
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: null });
            }

            resolve(response);
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
};


export default {
    getSubCategory
};