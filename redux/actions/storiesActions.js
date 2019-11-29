import ax from 'axios';
import { API, VISITOR_TOKEN } from '../../config';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: 'https://api.rctiplus.com/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});

const getStories = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/stories?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                const data = response.data.data;
                dispatch({ 
                    type: 'STORIES', 
                    data: data,
                    image_path: response.data.meta.image_path,
                    video_path: response.data.meta.video_path
                });
                resolve(data);
            }
            else {
                reject(response);
            }
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const getStory = (page = 1, length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/story?page=${page}&length=${length}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_STORY',
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
};

const getProgramStories = (programId, type) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/story/${programId}?type=${type}`);
            if (response.data.status.code === 0) {
                dispatch({
                    type: 'GET_PROGRAM_STORIES',
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
};

export default {
    getStories,
    getStory,
    getProgramStories
};