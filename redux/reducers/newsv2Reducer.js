import sortBy from 'lodash/sortBy'

const initialState = {
    data: null,
    data_topic: [],
    data_tag: [],
    data_section: null,
    data_section_article: [],
    search_result: [],
    meta: null,
    query: '',
    search_page: 1,
    search_show_more_allowed: false,
    is_searching: false,
    loading: true,
    isMorePage: false,
    countSection: 0,
};

export default function NewsReducer (state = initialState, action) {
    switch (action.type) {
        case 'GET_SECTION_NEWS':
            if(state.data_section === null) {
                return {...state, data_section: action.payload}
            }
            return {...state, data_section: {
                data: [...state?.data_section?.data, action.payload.data],
                meta: action.payload.meta,
                status: action.payload.status
            }}
        case 'GET_LIST_TAG_LOADING':
            return Object.assign({}, state, { loading: action.loading });
        case 'GET_TRENDING_CONTENT':
            return Object.assign({}, state, { data: action.data });
        case 'GET_TOPIC':
            let data = action.data
            data = sortBy(data, ['sorting', 'tag']);
            return Object.assign({}, state, { data_topic: data });
        case 'GET_LIST_TAG':
            return Object.assign({}, state, { data_tag: action.data });
        case 'GET_MORE_PAGE':
            return Object.assign({}, state, { isMorePage: action.data });
        case 'GET_LIST_TAG_MORE':
            return Object.assign({}, state, { data_tag: {
                ...state.data_tag,
                data: [ ...state.data_tag?.data, ...action?.data?.data],
                meta: { ...state.data_tag?.meta, ...action?.data?.meta }
            }, isMorePage: false });
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
        case 'ADD_SECTION':
            return Object.assign({}, state, {
                countSection: state.countSection + 1
            });
        default:
            return state;
    }
};