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
  ReactGA.initialize(process.env.GA_INIT_ID)
}

export const stickyAdsShowing = (data, event = 'gtag-event-rctiplus', channel_type = 'live-tv') => {
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

export const redirectToVisionPlus = (user) => {
  const rplusUserId = !user ? "" : user?.id

  ReactGA.initialize(process.env.GA_INIT_ID, {
    titleCase: false
  })
  ReactGA.set({
    "user_id": rplusUserId, // RCTI+ user id or leave blank if user is not logged in
    "date_time": new Date().toISOString(),
    "client_id": process.env.GA_INIT_ID,
    "pillar": "video"
  })
  ReactGA.event({
    category: 'library',
    action: 'click_go_to_visionplus',
    label: 'redirect_to_visionplus',
    name: "general_event"
  })
}

export const redirectToTrebel = (user) => {
  const rplusUserId = !user ? "" : user?.id
  
  ReactGA.initialize(process.env.GA_INIT_ID, {
    titleCase: false
  })
  ReactGA.set({
    "user_id": rplusUserId, // RCTI+ user id or leave blank if user is not logged in
    "date_time": new Date().toISOString(),
    "client_id": process.env.GA_INIT_ID,
    "pillar": "music"
  })
  ReactGA.event({
    category: 'music_interaction',
    action: 'click_go_to_trebel',
    label: 'redirect_to_trebel',
    name: "click_go_to_trebel"
  })
}

export const bottomMenuClick = (user, params) => {
  const rplusUserId = !user ? "" : user?.id
  
  ReactGA.initialize(process.env.GA_INIT_ID, {
    titleCase: false
  })
  ReactGA.set({
    "user_id": rplusUserId, // RCTI+ user id or leave blank if user is not logged in
    "date_time": new Date().toISOString(),
    "client_id": process.env.GA_INIT_ID,
    "pillar": params.pillar,
    "button_name": params.button_name
  })
  ReactGA.event({
    category: 'bottom_menu_clicked',
    action: 'menu_navbar_tracking',
    label: params.button_name,
    name: "click_bottom_menu"
  })
}

export const trebelPage = (user, source = '') => {
  const rplusUserId = !user ? "" : user?.id
  
  ReactGA.initialize(process.env.GA_INIT_ID, {
    titleCase: false
  })
  ReactGA.set({
    "user_id": rplusUserId, // RCTI+ user id or leave blank if user is not logged in
    "date_time": new Date().toISOString(),
    "client_id": process.env.GA_INIT_ID,
    "page_type": 'trebel_page',
    "pillar": 'music',
    "source": source
  })
  ReactGA.event({
    category: 'trebel_page',
    action: 'trebel_page',
    label: 'trebel_page',
    name: "trebel_page"
  })
}