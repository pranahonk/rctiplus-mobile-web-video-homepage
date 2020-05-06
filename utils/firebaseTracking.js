import { getCookie } from '../utils/cookie';
import { formatDateTime } from '../utils/dateHelpers';
import ReactGA from 'react-ga';

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

export const initGA = () => {
  console.log('GA init')
  ReactGA.initialize('GTM-WJNRTJP')
}

export const stickyAdsShowing = (data, event = 'gtag-event-rctiplus', channel_type = 'live-tv') => {
  console.log(event);
  ReactGA.event({
    'action' : event,
    'value' : {
      sponsor_id: data.id,
      channel_id: data.channel_id,
      channel_type: channel_type,
      type: data.type,
      users_id: getUserId(),
      date_time: new Date().getTime() / 1000,
    },
  });
};

export const stickyAdsClicked = (data, event = 'gtag-event-rctiplus', status = 'clicked') => {
  console.log(event);
  ReactGA.event({
    'action' : event,
    'value' : {
      sponsor_id: data.id,
      channel_id: data.channel_id,
      channel_type: status,
      type: data.type,
      users_id: getUserId(),
      date_time: new Date().getTime() / 1000,
    },
  });
};
