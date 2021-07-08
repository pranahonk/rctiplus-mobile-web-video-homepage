const initialState = {
    data: null,
    meta: null,
    status: null,
    show_more_allowed: false,
    search_results: [],
    query: '',
    active_tab: 'program',
    search_page: {
        program: 1,
        episode: 1,
        extra: 1,
        clip: 1,
        photo: 1
    },
    search_show_more_allowed: {
        program: false,
        episode: false,
        extra: false,
        clip: false,
        photo: false
    },
    search_status: false,
    search_all: [],
    search_popular: [],
    search_history: [],
    search_suggestion: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH':
        case 'SEARCH_BY_GENRE':
        case 'GET_RECOMMENDATION':
        case 'GET_RELATED_PROGRAM':
            return Object.assign({}, state, {  data: action.data,   meta: action.meta,  status: action.status});
        case 'SET_SHOW_MORE_ALLOWED':
            return Object.assign({}, state, { show_more_allowed: action.allowed });
        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, { active_tab: action.tab });
        case 'SET_SEARCH_STATUS':
            return Object.assign({}, state, { search_status: false });
        case 'SEARCH_ALL':
            return Object.assign({}, state, { search_all: action.all });
        case 'GET_SEARCH_POPULAR':
            return Object.assign({}, state, { search_popular: action.popular });
        case 'GET_SEARCH_HISTORY':
            return Object.assign({}, state, { search_history: action.history });
        case 'GET_SEARCH_SUGGESTION':
            return Object.assign({}, state, { search_suggestion: action.suggestion });
            case 'RESETs_SEARCH_SUGGESTION':
        return Object.assign({}, state, { search_suggestion: action.suggestion });
        case 'SEARCH_RESULTS':
            const more_allowed = action.search_show_more_allowed;
            return Object.assign({}, state, { 
                search_results: action.results, 
                search_status: true,
                meta: action.meta,
                query: action.query,
                search_show_more_allowed: action.search_show_more_allowed,
                search_page: {
                    program: more_allowed['program'] ? 2 : 1,
                    episode: more_allowed['episode'] ? 2 : 1,
                    extra: more_allowed['extra'] ? 2 : 1,
                    clip: more_allowed['clip'] ? 2 : 1,
                    photo: more_allowed['photo'] ? 2 : 1
                }
            });
        case 'SEARCH_RESULTS_CATEGORY':
            let results = state.search_results;

            let more = state.search_show_more_allowed;
            more[action.category] = action.show_more_allowed;
            
            let page = state.search_page;
            if (action.show_more_allowed) {
                page[action.category]++;
            }

            if (action.category === 'program') {
                results[0].data.data.push.apply(results[0].data.data, action.results);
            }
            else if (action.category === 'episode') {
                results[1].data.data.push.apply(results[1].data.data, action.results);
            }
            else if (action.category === 'extra') {
                results[2].data.data.push.apply(results[2].data.data, action.results);
            }
            else if (action.category === 'clip') {
                results[3].data.data.push.apply(results[3].data.data, action.results);
            }
            else if (action.category === 'photo') {
                results[4].data.data.push.apply(results[4].data.data, action.results);
            }
            return Object.assign({}, state, { 
                search_results: results,
                search_page: page,
                search_show_more_allowed: more,
                search_status: true,
            });
        default:
            return state;
    }
};