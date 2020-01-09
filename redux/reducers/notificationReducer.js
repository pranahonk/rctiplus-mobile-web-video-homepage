const initialState = {
    content: '',
    show: false,
    success: true,
    progress: false,
    size: 'small'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return Object.assign({}, state, {
                content: action.content,
                show: action.show,
                success: action.success,
                size: action.size,
                progress: false
            });    
        
        case 'HIDE_NOTIFICATION':
            return Object.assign({}, state, { show: action.show, progress: false });
        
        case 'PROGRESS_NOTIFICATION':
            return Object.assign({}, state, { show: action.show, progress: true });

        default:
            return state;
    
    }
};