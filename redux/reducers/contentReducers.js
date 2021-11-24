const initialState = {
    homepage_content: [],
    banner: [],
    meta: {},
    data: null,
    status: null,
    selected_season: 1,
    episodes: [],
    extras: [],
    photos: [],
    clips: [],
    current_page: 1,
    current_extra_page: 1,
    current_photo_page: 1,
    current_clip_page: 1,
    show_more_allowed: true,
    show_more_extra_allowed: true,
    show_more_photo_allowed: true,
    show_more_clip_allowed: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'HOMEPAGE_CONTENT':
            return {
                ...state,
                homepage_content: state.homepage_content.concat(action.data),
                meta: action.meta
            }
        case 'BANNER':
            return Object.assign({}, state, { banner: action.data, meta: action.meta });
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
        case 'GET_PROGRAM_EXTRAS':
            let extras = state.extras;
            if (action.current_extra_page > 2) {
                extras.push.apply(extras, action.extras);
            }
            else {
                extras = action.extras;
            }
            return Object.assign({}, state, {
                extras: extras,
                current_extra_page: action.current_extra_page
            });
        case 'GET_PROGRAM_PHOTOS':
            let photos = state.photos;
            if (action.current_photo_page > 2) {
                photos.push.apply(photos, action.photos);
            }
            else {
                photos = action.photos;
            }
            return Object.assign({}, state, {
                photos: photos,
                current_photo_page: action.current_photo_page
            });
        case 'GET_PROGRAM_CLIPS':
            let clips = state.clips;
            if (action.current_clip_page > 2) {
                clips.push.apply(clips, action.clips);
            }
            else {
                clips = action.clips;
            }
            return Object.assign({}, state, {
                clips: clips,
                current_clip_page: action.current_clip_page
            });
        case 'SET_SHOW_MORE_ALLOWED':
            return Object.assign({}, state, { show_more_allowed: action.allowed });
        case 'SET_SHOW_MORE_EXTRA_ALLOWED':
            return Object.assign({}, state, { show_more_extra_allowed: action.allowed });
        case 'SET_SHOW_MORE_PHOTO_ALLOWED':
            return Object.assign({}, state, { show_more_photo_allowed: action.allowed });
        case 'SET_SHOW_MORE_CLIP_ALLOWED':
            return Object.assign({}, state, { show_more_clip_allowed: action.allowed });
        default:
            return state;
    }
};