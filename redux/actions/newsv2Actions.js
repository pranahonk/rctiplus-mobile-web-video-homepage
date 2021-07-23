import ax from 'axios';
import { NEWS_API_V2 } from '../../config';
import { getNewsTokenV2, checkToken, removeAccessToken, getAccessToken, getUserAccessToken } from '../../utils/cookie';

const axios = ax.create({ baseURL: NEWS_API_V2 + '/api' });

axios.interceptors.request.use(async (request) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        removeAccessToken();
        await checkToken();
        request.headers['Authorization'] = getNewsTokenV2();
    }
    else {
        request.headers['Authorization'] = accessToken;
    }
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const searchSuggest =  (q, item = 1, itemSize = 4) => {
  return dispatch => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/recommendation/suggest?item=${item}&itemSize=${itemSize}&query=${q}`);
      if (response.status === 200) {
        resolve(response);
      }
      else {
        removeAccessToken();
        reject(response);
      }
    }
    catch (error) {
      removeAccessToken();
      reject(error);
    }
  });

}

const readAlso = (id,page = 1, pageSize = 2) => {
  return dispatch => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/news/api/v1/readalso/${id}?page=/${page}&pageSize=${pageSize}`);
      if (response.status === 200) {
        resolve(response);
      }
      else {
        removeAccessToken();
        reject(response);
      }
    }
    catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};

const clearSearch = () => {
    return dispatch => dispatch({
        type: 'CLEAR_SEARCH'
    });
};

const getSearchFromServer = (data) => {
    return dispatch => {
        dispatch({
            type: 'SEARCH_NEWS_RESULT',
            result: data?.data || [],
            meta: data?.meta || null,
            query: data.keyword,
            search_show_more_allowed: data.data?.length >= length
        });
    }
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const addCategory = categoryId => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/kanal`, {
                category: categoryId
            });
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const deleteCategory = categoryId => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete(`/v1/kanal/${categoryId}`);
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};
const deleteCategoryVisitors = (categoryId, device_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete(`/v2/kanal/delete/${categoryId}`,{
              data: {
                device_id: device_id,
              }
            });
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const updateCategoryOrder = (categoryId, sorting) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/update_kanal`, {
                category: categoryId,
                sorting: sorting
            });
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const updateCategoryOrderVisitor = (categoryId, sorting, device_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v2/kanal/update`, {
                category_id: categoryId,
                sorting: sorting,
                device_id: device_id
            });
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getSectionNews = (category_id = 16, pageSize = 3, page = 1) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/section?category_id=${category_id}&page=${page}&pageSize=${pageSize}`);
            if (response.status === 200 && response.data.status.code === 0) {
                dispatch({
                    type: 'GET_SECTION_NEWS',
                    payload: response.data,
                });
                resolve(response.data);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};
const getSectionArticle = (section_id = 1, page = 1, pageSize = 6) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/section/${section_id}/content?page=${page}&pageSize=${pageSize}`);
            if (response.status === 200 && response.data.status.code === 0) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getNews = (subcategoryId = 1, pageSize = 10, page = 1) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news?subcategory_id=${subcategoryId}&page=${page}&pageSize=${pageSize}`);

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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getRelatedArticles = (id, page = 1, pageSize = 10) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/related/${id}?page=${page}&pageSize=${pageSize}`);
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getChannelsVisitor = (device_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/kanal?visitor=${device_id}`);
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getSelectedChannelsVisitor = (device_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v2/kanal/list?visitor=${device_id}`);
            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const incrementCount = ( newsId, visitorId) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/news/count`, {
                news_id: newsId,
                visitor_id: visitorId,
            });

            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
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
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const getTagTrending = (length = 10) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/tag/trending?length=${length}`);
            if (response.status === 200) {
                dispatch({
                    type: 'GET_TOPIC',
                    data: response.data,
                    status: response.status,
                    loading: false
                });
                resolve(response);
                dispatch({
                    type: 'GET_LIST_TAG_LOADING',
                    loading: false
                });
            }
            else {
                dispatch({
                    type: 'GET_LIST_TAG_LOADING',
                    loading: false
                });
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};
const getMorePage = (value) => {
    return dispatch => {
        dispatch({
            type: 'GET_MORE_PAGE',
            data: value
        })
    }
}
const setLike = (news_id, love, device_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/like`, { news_id, love, device_id });
                if (response.status === 200) {
                    resolve(response);
                }
                else {
                removeAccessToken();
                reject(response);
            }
        }
        catch(err) {
            removeAccessToken();
            reject(err)
        }
    })
}
const getTagByNews = (news_id) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/news/${news_id}/tag`);
                if (response.status === 200) {
                    resolve(response);
                }
                else {
                removeAccessToken();
                reject(response);
            }
        }
        catch(err) {
            removeAccessToken();
            reject(err)
        }
    })
}
const getListTag = (key = '', page = 1, isMore= false) => {
    return dispatch => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/v1/tag/${key}?page=${page}&length=10`);
            if (response.status === 200) {
                isMore ?
                   dispatch({
                        type: 'GET_LIST_TAG_MORE',
                        data: response.data,
                        loading: false
                    })
                 : dispatch({
                        type: 'GET_LIST_TAG',
                        data: response.data,
                        loading: false
                    })
                dispatch({
                    type: 'GET_LIST_TAG_LOADING',
                    loading: false
                });
                resolve(response);
            }
            else {
                dispatch({
                    type: 'GET_LIST_TAG_LOADING',
                    loading: false
                });
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const incrementCountTag = tagName => {
    return () => new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`/v1/tag/count`, {
                tag: tagName
            });

            if (response.status === 200) {
                resolve(response);
            }
            else {
                removeAccessToken();
                reject(response);
            }
        }
        catch (error) {
            removeAccessToken();
            reject(error);
        }
    });
};

const addCategoryVisitorV2 = (categoryId, device_id) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/kanal/add`, {
        category_id: categoryId,
        device_id: device_id,
        sorting: 1
      });
      if (response.status === 200) {
        resolve(response);
      } else {
        removeAccessToken();
        reject(response);
      }
    } catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};

const userRecomendation = (page = 1, pageSize = 4) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`/v2/recommendation?page=${page}&pageSize=${pageSize}`);
      if (response.status === 200) {
        resolve(response);
      } else {
        removeAccessToken();
        reject(response);
      }
    } catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};

const saveUserRecomendation = (userSearch) => {
  return () => new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/v2/recommendation/search`, {
        "qry": userSearch
      });
      if (response.status === 200) {
        resolve(response);
      } else {
        removeAccessToken();
        reject(response);
      }
    } catch (error) {
      removeAccessToken();
      reject(error);
    }
  });
};

const setSection = () => dispatch => dispatch({ type: "ADD_SECTION" })


export default {
    clearSearch,
    setQuery,
    toggleIsSearching,
    searchNews,
    setSearch,
    setCategory,
    getCategory,
    addCategory,
    deleteCategory,
    updateCategoryOrder,
    getTrending,
    getNews,
    getArticle,
    getRelatedArticles,
    getChannels,
    getChannelsVisitor,
    getPopularSearch,
    incrementCount,
    getTagTrending,
    getListTag,
    getSectionArticle,
    getMorePage,
    setLike,
    getTagByNews,
    getSearchFromServer,
    incrementCountTag,
    readAlso,
    getSectionNews,
    setSection,
    addCategoryVisitorV2,
    getSelectedChannelsVisitor,
    updateCategoryOrderVisitor,
    deleteCategoryVisitors,
    userRecomendation,
    saveUserRecomendation,
    searchSuggest,
};
