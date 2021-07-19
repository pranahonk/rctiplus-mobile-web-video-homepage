const initialState = {
    data: null,
    data_epg: null,
    data_epg_v2: null,
    data_live: null,
    detail_live: null,
    list_live: null,
    meta: null,
    status: null,
    catchup_date: null,
    catchup: [],
    channel_code: 'rcti',
    loading_live_event: false,
    error_live_event: false,
    duration_ads: {
        refreshDuration: 0,
        reloadDuration: 0
      }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOADING_LIVE_EVENT':
            return { ...state, loading_live_event: true, error_live_event: false }
        case 'ERROR_LIVE_EVENT':
            return { ...state, error_live_event: true, loading_live_event: false }
        case 'GET_LIVE_EVENT':
            return { ...state, 
                status: action.status,
                data: action.data,
                meta: action.meta,
                data_live: action.data,
                channel_code: action.channel
            }
        case 'GET_LIVE_EVENT_DETAIL':
            return { ...state, 
                status: action.status,
                data: action.data,
                meta: action.meta,
                list_live: action.data,
            }
        case 'GET_LIVE_EVENT_URL':
            return { ...state, 
                status: action.status,
                data: action.data,
                meta: action.meta,
                detail_live: action.data,
            }
        case 'GET_EPG':
            return { ...state, 
                status: action.status,
                data: action.data,
                meta: action.meta,
                data_epg: action.data,
            }
        case 'GET_EPG_V2':
            return { ...state, 
                status: action.status,
                data: action.data,
                meta: action.meta,
                data_epg_v2: action.data,
            }
        case 'GET_ALL_LIVE_EVENT':
        case 'POST_CHAT':
        case 'GET_MISSED_EVENT':
            return Object.assign({}, state, {
                status: action.status,
                data: action.data,
                meta: action.meta,
                loading_live_event: false,
            });
        case 'GET_LIVE_QUIZ':
        case 'GET_LIVE_QUIZ_URL':
            return Object.assign({}, state, { 
                status: action.status, 
                data: action.data, 
                meta: action.meta
            });
        case 'GET_CATCHUP_URL':
            return Object.assign({}, state, { 
                status: action.status, 
                data: action.data, 
                meta: action.meta ,
                detail_live: action.data,
            });
        case 'GET_DURATION_ADS':
            return {...state, duration_ads: action.data}
        case 'GET_CHAT_BLOCK':
            return Object.assign({}, state, {
                status: action.status,
                data: action.data,
            });
        case 'SET_CATCHUP_DATE':
            return Object.assign({}, state, { catchup_date: action.date });
        case 'SET_CHANNEL_CODE':
            return Object.assign({}, state, { channel_code: action.channel_code });
        case 'SET_CATCHUP_DATA':
            return Object.assign({}, state, { catchup: action.catchup.length > 0 ? action.catchup : [] });
        default:
            return state;
    }
};