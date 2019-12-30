const initialState = {
    data: null,
    meta: null,
    status: null,
    otp: null,
    username: null,
    password: null,
    fullname: '',
    dob: '',
    gender: '',
    device_id: null,
    username_type: null,
    email_invalid: false,
    phone_invalid: false,
    active_tab: '2'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER':
            return Object.assign({}, state, { data: action.data, meta: action.meta });
        case 'CHECK_USER':
        case 'FORGOT_PASSWORD':
        case 'CREATE_NEW_PASSWORD':
            return Object.assign({}, state, { status: action.status });
        case 'USERNAME':
            return Object.assign({}, state, { username: action.username });
        case 'PASSWORD':
            return Object.assign({}, state, { password: action.password });
        case 'FULLNAME':
            return Object.assign({}, state, { fullname: action.fullname });
        case 'GENDER':
            return Object.assign({}, state, { gender: action.gender });
        case 'DOB':
            return Object.assign({}, state, { dob: action.dob });
        case 'USERNAME_TYPE':
            return Object.assign({}, state, { username_type: action.username_type });
        case 'OTP':
            return Object.assign({}, state, { otp: action.otp });
        case 'SET_EMAIL_STATUS':
            return Object.assign({}, state, { email_invalid: action.invalid });
        case 'SET_PHONE_STATUS':
            return Object.assign({}, state, { phone_invalid: action.invalid });
        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, { active_tab: action.tab });
        default:
            return state;
    }
};