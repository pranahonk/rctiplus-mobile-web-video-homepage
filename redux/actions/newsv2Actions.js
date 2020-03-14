import ax from 'axios';
import { NEWS_API_V2 } from '../../config';
import { getNewsTokenV2, getNewsToken, checkToken, getCookie } from '../../utils/cookie';

const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    request.headers['Authorization'] = getNewsTokenV2();
    return request;
});

const searchNews = (q, page = 1, pageSize = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/search?q=${q}&page=${page}&pageSize=${pageSize}`);
            if (response.status === 200) {
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

const setCategory = categories => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/category`, {
                category: categories
            });
            if (response.status === 200) {
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

const getCategory = () => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/category`);
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

const getTrending = (category = 1, pageSize = 5, page = 1) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/trending?category=${category}&page=${page}&pageSize=${pageSize}`);
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

const getNews = (subcategoryId = 1, pageSize = 10, page = 1) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news?subcategory=${subcategoryId}&page=${page}&pageSize=${pageSize}`);

            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_NEWS',
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

const getArticle = id => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/${id}`);
            if (response.status === 200) {
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

const getRelatedArticles = (id, page = 1, pageSize = 4) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/related/${id}?page=${page}&pageSize=${pageSize}`);
            if (response.status === 200) {
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

const getChannels = () => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/kanal`);
            if (response.status === 200) {
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

const incrementCount = newsId => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/news/count`, {
                news_id: newsId
            });
            
            if (response.status === 200) {
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

const getPopularSearch = () => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/populer_search`);
            if (response.status === 200) {
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
    clearSearch,
    setQuery,
    toggleIsSearching,
    searchNews,
    setSearch,
    setCategory,
    getCategory,
    getTrending,
    getNews,
    getArticle,
    getRelatedArticles,
    getChannels,
    getPopularSearch,
    incrementCount
};