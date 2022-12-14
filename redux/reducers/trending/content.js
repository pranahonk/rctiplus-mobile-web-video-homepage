const initialState = {
    data: null,
    search_result: [],
    meta: null,
    query: '',
    search_page: 1,
    search_show_more_allowed: false,
    is_searching: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TRENDING_CONTENT':
            return Object.assign({}, state, { data: action.data });
        case 'SET_QUERY':
            return Object.assign({}, state, { query: action.q });
        case 'SET_SEARCH':
            action.subject.next();
            return Object.assign({}, state, { query: action.q });
        case 'CLEAR_SEARCH':
            return Object.assign({}, state, {  
                search_result: [],
                meta: null,
                search_show_more_allowed: false,
                search_page: 1
            });
        case 'SEARCH_NEWS_RESULT':
            let result = state.search_result;
            result.push.apply(result, action.result);

            return Object.assign({}, state, {
                search_result: result,
                meta: action.meta,
                query: action.query,
                search_show_more_allowed: action.search_show_more_allowed,
                search_page: action.search_show_more_allowed ? ++state.search_page : 1
            });
        case 'TOGGLE_IS_SEARCHING':
            return Object.assign({}, state, {
                is_searching: action.is_searching
            });
        default:
            return state;
    }
};