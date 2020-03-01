import ax from 'axios';
import { NEWS_API } from '../../../config';
import { getNewsToken, checkToken } from '../../../utils/cookie';

const axios = ax.create({ baseURL: NEWS_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getNewsToken();
    return request;
});

const getTrendingContent = (subcategory_id = 12, page = 1, length = 5, info = 'id,cover,title,content,pubDate,source') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news?info=${info}&subcategory_id=${subcategory_id}&page=${page}&pageSize=${length}`);

            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_TRENDING_CONTENT',
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

const getTrendingRelated = (id, pageSize = 4, infos = 'id,title,cover,link,guid') => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/related/${id}?pageSize=${pageSize}&infos=${infos}`);
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

const getNewsFavoriteStatus = newsId => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/like/${newsId}`);
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

const setNewsFavorite = (newsId, love) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/like`, {
                newsId: newsId,
                love: love
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

const searchNews = (q, page = 1, length = 10, index = 'newz') => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/search/${index}?q=${q}&page=${page}&length=${length}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'SEARCH_NEWS_RESULT',
                    result: response.data.data,
                    meta: response && response.data && response.data.meta ? response.data.meta : null,
                    query: q,
                    search_show_more_allowed: response.data.data.length >= length
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

const clearSearch = () => {
    return dispatch => dispatch({
        type: 'CLEAR_SEARCH'
    });
};

const setSearch = (q, subject) => {
    return dispatch => dispatch({
        type: 'SET_SEARCH',
        q: q,
        subject: subject
    });
};

const setQuery = q => {
    return dispatch => dispatch({
        type: 'SET_QUERY',
        q: q
    });
};

const toggleIsSearching = isSearching => {
    return dispatch => dispatch({
        type: 'TOGGLE_IS_SEARCHING',
        is_searching: isSearching
    });
};

export default {
    getTrendingContent,
    getTrendingRelated,
    getNewsFavoriteStatus,
    setNewsFavorite,
    searchNews,
    clearSearch,
    setSearch,
    setQuery,
    toggleIsSearching
};