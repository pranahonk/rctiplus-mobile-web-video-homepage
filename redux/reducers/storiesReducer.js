const initialState = {
    data: null,
    image_path: null,
    video_path: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORIES':
            return Object.assign({}, state, { 
                data: action.data, 
                image_path: action.image_path, 
                video_path: action.video_path 
            });
        default:
            return state;
    }
};