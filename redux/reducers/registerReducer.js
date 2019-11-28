const initialState = {
    data: null,
    meta: null,
    status: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER':
            return Object.assign({}, state, { data: action.data, meta: action.meta });
        case 'CHECK_USER':
        case 'FORGOT_PASSWORD':
        case 'CREATE_NEW_PASSWORD':
            return Object.assign({}, state, { status: action.status });
        default:
            return state;
    }
};