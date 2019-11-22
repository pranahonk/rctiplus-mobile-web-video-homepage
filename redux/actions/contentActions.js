import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';

const axios = ax.create({
    baseURL: API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    // console.log(error.response);
});

const getContents = page => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/homepage?page=${page}`);
            if (response.data.status.code === 0) {
                let contents = [];
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
                        }
                        catch (e) {
                            // console.log(e);
                        }
                    }
                }
                dispatch({ type: 'HOMEPAGE_CONTENT', data: contents, meta: response.data.meta });
            }
            else {

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
    getContents
};