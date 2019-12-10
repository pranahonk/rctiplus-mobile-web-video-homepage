const initialState = {
    content: '',
    show: false,
    success: true,
    size: 'small'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return Object.assign({}, state, {
                content: action.content,
                show: action.show,
                success: action.success,
                size: action.size
            });    
        
        case 'HIDE_NOTIFICATION':
            return Object.assign({}, state, { show: action.show });

        default:
            return state;
    
    }
};