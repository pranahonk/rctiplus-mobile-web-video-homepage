import ax from 'axios';
import { DEV_API } from '../../config';
import { getCookie, getVisitorToken, checkToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

export const getActiveCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/category`);

            if (response.data.status.code === 0) {
                console.log(`ini aktif kategori`,response.data.data)
                dispatch({
                    type: 'ACTIVE_CATEGORY',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
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
}

export const getSubCategory = (category_id) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/category/${category_id}/sub-category`);

            if (response.data.status.code === 0) {
                console.log(`hahah data sub categiry`, response.data)
                dispatch({
                    type: 'SUB_CATEGORY',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
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
}

export const getBannerCategory = () => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/banner`);

            if (response.data.status.code === 0) {
                dispatch({
                    type: 'BANNER_CATEGORY',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
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
}

export const getBannerCategoryActive = (category_id) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/banner/category/${category_id}?page=1&length=21`);

            if (response.data.status.code === 0) {
                console.log(`ini banner haha`, response.data)
                dispatch({
                    type: 'BANNER_CATEGORY_ACTIVE',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
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
}

export const getStoriesCategory = (category_id, page = 1, length= 6) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/stories/category/${category_id}?page=${page}&length=${length}`);
            console.log(response.data)
            if (response.data.status.code === 0) {
                console.log(`ini stories category haha`, response.data)
                dispatch({
                    type: 'STORIES_CATEGORY',
                    data: response.data.data, 
                    meta: response.data.meta, 
                    status: response.data.status
                });
                resolve(response);
            }
            else {
                reject(response);
            }
        }
        catch (error) {
            reject(error);
            console.log(err)
        }
    });
}

export const getHomepageCategory = (page=1, length=6, category_id) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/homepage/category/${category_id}?platform=mweb&page=${page}&length=${length}`);

            let contents = [];
            if (response.data.status.code === 0) {
                const data = response.data.data;
                let selectedData = [];
                let promises = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].total_content > 0) {
                        if(data[i].content_type === "content"){
                            promises.push(axios.get(`/v1/homepage/${data[i].id}/contents?page=${1}&length=${7}`)
                            .catch((err) => {
                                console.log('err', err);
                            }));
                            selectedData.push(data[i]);
                        }
                        else if(data[i].content_type === "story"){
                            promises.push(axios.get(`/v1/homepage/${data[i].id}/stories?page=${1}&length=${7}`)
                            .catch((err) => {
                                console.log('err', err);
                            }));
                            selectedData.push(data[i]);
                        }
                    }
                    else if (data[i].type === 'custom' && data[i].api) {
                        promises.push(axios.get(data[i].api)
                        .catch((err) => {
                            console.log('err', err);
                        }));
                        selectedData.push(data[i]);
                    }
                }
                
                const results = await Promise.all(promises);
                for (let i = 0; i < results.length; i++) {
                    if (!results[i]) {
                        continue;
                    }
                    
                    let content = {}
                    if (results[i] && results[i].status === 200 && results[i].data && results[i].data.status.code === 0) {
                        content = {
                            content: results[i].data.data,
                            ...selectedData[i]
                        };
                    }
                    else if (results[i].data.status.code === 13) {
                        if (!getCookie('SIGNIN_POPUP_SHOWN')) setSigninPopupFlag(true);
                    }
                    contents.push(content);
                }
                dispatch({ type: 'HOMEPAGE_CATEGORY', data: contents, meta: response.data.meta });
            }
            else {
                dispatch({ type: 'HOMEPAGE_CATEGORY', data: contents, meta: null });
            }
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    });
}