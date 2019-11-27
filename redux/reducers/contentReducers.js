const initialState = {
    homepage_content: [],
    banner: null,
    meta: null,
    data: null,
    status: null
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
        default:
            return state;
    }
};