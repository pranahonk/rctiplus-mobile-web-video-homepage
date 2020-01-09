const initialState = {
    data: null,
    meta: null,
    status: null,
    data_key: ['nickname', 'fullname', 'dob', 'gender', 'phone_number', 'email', 'otp', 'location'],
    nickname: '',
    fullname: '',
    dob: '',
    gender: '',
    phone_number: '',
    email: '',
    otp: '',
    location: '',
    profile_photo_src: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PROFILE':
        case 'CHECK_USER':
            return Object.assign({}, state, { status: action.status });
        case 'USER_DATA':
            return Object.assign({}, state, { data: action.data, meta: action.meta });
        case 'INTERESTS':
            return Object.assign({}, state, { data: action.data, meta: action.meta, status: action.status });
        case 'SET_PROFILE':
            return Object.assign({}, state, {
                nickname: action.nickname,
                fullname: action.fullname,
                dob: action.dob,
                gender: action.gender,
                phone_number: action.phone_number,
                email: action.email,
                otp: action.otp,
                location: location
            });
        case 'SET_VALUE':
            let newValue = {};
            newValue[state.data_key[action.index]] = action.value;
            return Object.assign({}, state, newValue);

        case 'SET_PROFILE_PHOTO_SRC':
            return Object.assign({}, state, { profile_photo_src: action.src });
        default:
            return state;
    }
};