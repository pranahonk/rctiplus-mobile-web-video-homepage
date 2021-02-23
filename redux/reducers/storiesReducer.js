const initialState = {
    data: null,
    meta: null,
    status: null,
    image_path: null,
    video_path: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORIES':
            /* return Object.assign({}, state, { 
                data: action.data, 
                image_path: action.image_path, 
                video_path: action.video_path 
            }); */
        case 'GET_STORY':
        case 'GET_PROGRAM_STORIES':
            return Object.assign({}, state, {
                data: action.data,
                meta: action.meta,
                status: action.status
            });
        default:
            return state;
    }
};