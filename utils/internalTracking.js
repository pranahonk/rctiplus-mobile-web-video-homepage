import axios from 'axios';
import { getCookie } from '../utils/cookie';
import { formatDateTime } from '../utils/dateHelpers';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

export const getUserId = () => {
    const accessToken = getCookie(TOKEN_KEY);
    let userId = new DeviceUUID().get();
    if (accessToken) {
        try {
            userId = jwtDecode(accessToken).vid;
        }
        catch (e) {
            console.log(e);
        }
    }

    return userId;
};

// const instance =  axios.create({baseURL: 'https://rctiplus.addpush.com/probes/event.php'});


// export const RPLUSAdsShowing = (value,eventType, eventName ,platform = 'MWEB') => {
//   const data = {
//     'event-type': eventType,
//     'event-name': eventName,
//     'event-value': {
//       'sponsor_id': value.data.id || 'N/A',
//       'channel_id': value.data.channel_id || 'N/A',
//       'channel_type': value.data.channel || 'N/A',
//       'type': value.data.type || 'N/A',
//       'platform': platform,
//     },
//     'device-id': new DeviceUUID().get(),
//     'user-id': getUserId(),
//     'content-id': 'N/A',
//   };
//   instance.post('',data)
//   .then((response) => console.log(response))
//   .catch((error) => console.log(error));
// };

export const RPLUSAdsClicked = (value,eventType, eventName , clickType, platform = 'MWEB') => {
  const data = {
    'event-type': eventType,
    'event-name': eventName,
    'event-value': {
      'sponsor_id': value.id || 'N/A',
      'channel_id': value.channel_id || 'N/A',
      'channel_type': value.channel,
      'clicked_type': clickType,
      'type': value.type || 'N/A',
      'platform': platform,
    },
    'device-id': new DeviceUUID().get(),
    'user-id': getUserId(),
    'content-id': 'N/A',
  };
  // instance.post('',data)
  // .then((response) => console.log(response))
  // .catch((error) => console.log(error));
};

export const RPLUSAppVisit = (eventType = 'views', eventName = 'visit_apps', platform = 'MWEB') => {
  const data = {
    'event-type': eventType,
    'event-name': eventName,
    'event-value': {
      'platform': platform,
      'carrier': 'N/A'
    },
    'device-id': new DeviceUUID().get(),
    'user-id': getUserId(),
    'content-id': 'N/A'
  };
  // instance.post('', data)
  // .then((response) => console.log(response))
  // .catch((error) => console.log(error));
};