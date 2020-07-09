const initialState = {
    data: null,
    meta: null,
    status: null,
    label: '',
    field_type: '',
    notes: '',
    need_otp: false,
    placeholder: '',
    option_data: [],
    index: -1,
    disabled_condition: null,
    list_country: null, 
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return Object.assign({}, state, {
                label: action.label,
                field_type: action.field_type,
                notes: action.notes,
                need_otp: action.need_otp,
                placeholder: action.placeholder,
                option_data: action.option_data,
                index: action.index,
                disabled_condition: action.disabled_condition
            });
        case 'GET_LIST_COUNTRY':
            return Object.assign({}, state, { 
                list_country: action.data,
             })
        default:
            return state;
    }
};