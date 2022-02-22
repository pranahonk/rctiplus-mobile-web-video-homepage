import React from 'react';
import { getCookie } from './cookie';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

export const getUserId = () => {
  const accessToken = getCookie(TOKEN_KEY);
  let userId = "";
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




export const gaTrackerNavbarTrack = (event_category = 'string', event_action = 'string', event_label = 'string') => {
  if (typeof window !== 'undefined') {
    window.dataLayer.push({
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id' : getUserId(),
      'client_id': process.env.GA_360_USERID,
      'button_name' : event_label,
      'pillar' : 'general',

    });
  }
};


export const gaTrackerScreenView = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer.push({
      'client_id':  process.env.GA_360_USERID,
      'page_type' : "trebel_page",
      'pillar' : "music",
      'date_time' : new Date().toISOString(),
      'user_id' : getUserId(),
    });
  }
};



