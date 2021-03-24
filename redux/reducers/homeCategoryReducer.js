const initialState = {
    listMenuHomeCategory : {},
    subCategory: {},
    subBanner: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ACTIVE_CATEGORY':
            return {
                ...state,
                listMenuHomeCategory: { 
                    data: action.data,
                    meta: action.meta,
                    status: action.status
                },
              };
        case 'SUB_CATEGORY':
            return {
                ...state,
                subCategory: { 
                    data: action.data,
                    meta: action.meta,
                    status: action.status
                },
              };
        case 'BANNER_CATEGORY_ACTIVE':
            return {
                ...state,
                subBanner: { 
                    data: action.data,
                    meta: action.meta,
                    status: action.status
                },
            };
        default:
            return state;
    }
};