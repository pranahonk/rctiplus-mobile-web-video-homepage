const initialState = {
    homepage_content: [],
    banner: null,
    meta: null,
    data: null,
    status: null,
    selected_season: 1,
    episodes: [],
    current_page: 1,
    show_more_allowed: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'HOMEPAGE_CONTENT':
            return Object.assign({}, state, { homepage_content: action.data, meta: action.meta });
        case 'BANNER':
            return Object.assign({}, state, { banner: action.data, meta: action.meta });
        case 'GET_HOMEPAGE_CONTENTS':
        case 'GET_EPISODE_DETAIL':
        case 'GET_EPISODE_URL':
        case 'GET_EXTRA_DETAIL':
        case 'GET_EXTRA_URL':
        case 'GET_CLIP_DETAIL':
        case 'GET_CLIP_URL':
        case 'GET_PHOTO_DETAIL':
            return Object.assign({}, state, {
                meta: action.meta,
                data: action.data,
                status: action.status
            });
        case 'SELECT_SEASON':
            return Object.assign({}, state, { 
                selected_season: action.season,
                current_page: 1 
            });
        case 'GET_PROGRAM_EPISODES':
            let episodes = state.episodes;
            if (action.current_page > 2) {
                episodes.push.apply(episodes, action.episodes);
            }
            else {
                episodes = action.episodes;
            }
            return Object.assign({}, state, {
                episodes: episodes,
                current_page: action.current_page,
                selected_season: action.selected_season
            });
        case 'SET_SHOW_MORE_ALLOWED':
            return Object.assign({}, state, { show_more_allowed: action.allowed });
        default:
            return state;
    }
};