import React from 'react';
import { getCookie } from './cookie';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

export const getUserId = () => {
  const accessToken = getCookie(TOKEN_KEY);
  let userId ="";
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




export const gaTracker = (event_category = 'string', event_action = 'string', event_label = 'string', pilar = 'video') => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'pillar': pilar,
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
    });
  }
};


export const gaTrackerSearch = (event_category = 'string', event_action = 'string', event_label = 'string') => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'pillar': 'general',
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
    });
  }
};

export const gaTrackerBanner = (
  event_category = 'string',
  event_action = 'string',
  event_label = 'string',
  bannerId, program_id, content_type) => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'pillar': 'general',
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
      'banner_id': 'not_available',
      'banner_name': 'not_available',
      'content_id': 'not_available',
      'content_name': 'not_available',
      'content_type': content_type,
      'content_category': 'not_available',
      'program_id': program_id,
      'program_name': 'not_available',
      'competition_id': 'not_available',
      'competition_name': 'not_available',
      'publisher_id': 'not_available',
      'publisher_name': 'not_available',
      'channel_owner_id': 'not_available',
      'channel_owner': 'not_available',
      'classification_id': 'not_available',
      'classification': 'not_available',
    });
  }
};


export const gaTrackerCategory = (event_category = 'string', event_action = 'string', event_label = 'string', category_id, category_name) => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'category_id': category_id,
      'category_name': category_name,
      'pillar': 'video',
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
    });
  }
};

export const gaTrackerStory = (
  event_category = 'string',
  event_action = 'string',
  event_label = 'string',
  content_id, content_name, content_type) => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'pillar': 'video',
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
      'content_id': content_id,
      'content_name': content_name,
      'content_type': content_type,
      'content_category': 'not_available',
      'program_id': 'not_available',
      'program_name': 'not_available',
      'classification_id': 'not_available',
      'classification': 'not_available',
      'cluster_id': 'not_available',
      'cluster_name': 'not_available',
      'channel_owner_id': 'not_available',
      'channel_owner': 'not_available',
      'genre_level_1': 'not_available',
      'genre_level_2': 'not_available',
      'season_number': 'not_available',
      'episode_number': 'not_available',
      'is_premium': 'not_available',
    });
  }
};


export const gaTrackerLineUp = (
  event_category = 'string',
  event_action = 'string',
  event_label = 'string',
  content_id, content_name, content_type, content_category,
  program_id, program_name, classification_id, classification, cluster_id,
  cluster_name, channel_owner_id, channel_owner, genre_level_1, genre_level_2,
  season_number, episode_number, is_premium) => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'pillar': 'video',
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
      'content_id': content_id,
      'content_name': content_name,
      'content_type': content_type,
      'content_category': content_category,
      'program_id': program_id,
      'program_name': program_name,
      'classification_id': classification_id,
      'classification': classification,
      'cluster_id': cluster_id,
      'cluster_name': cluster_name,
      'channel_owner_id': channel_owner_id,
      'channel_owner': channel_owner,
      'genre_level_1': genre_level_1,
      'genre_level_2': genre_level_2,
      'season_number': season_number,
      'episode_number': episode_number,
      'is_premium': is_premium,
    });
  }
};


export const gaTrackerProgram = (
  event_category = 'string',
  event_action = 'string',
  event_label = 'string',
  content_category, program_id, program_name, classification_id, classification, cluster_id,
  cluster_name, channel_owner_id, channel_owner, genre_level_1, genre_level_2,
  is_premium) => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'event': 'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label': event_label,
      'user_id': getUserId(),
      'pillar': 'video',
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
      'content_category' : content_category,
      'program_id' :program_id,
      'program_name' : program_name,
      'classification_id' : classification_id,
      'classification' : classification,
      'cluster_id' : cluster_id,
      'cluster_name' : cluster_name,
      'channel_owner_id' : channel_owner_id,
      'channel_owner' : channel_owner,
      'genre_level_1' : genre_level_1,
      'genre_level_2' : genre_level_2,
      'is_premium' : is_premium
    });
  }
};

export const gaTrackerScreenView = () => {
  if (typeof window !== 'undefined' ) {
    window.dataLayer.push({
      'event': 'general_event',
      'pillar': 'video',
      'date_time': new Date().toISOString(),
    });
  }
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


// export const gaTrackerScreenView = () => {
//   if (typeof window !== 'undefined') {
//     window.dataLayer.push({
//       'client_id':  process.env.GA_360_USERID,
//       'page_type' : "trebel_page",
//       'pillar' : "music",
//       'date_time' : new Date().toISOString(),
//       'user_id' : getUserId(),
//     });
//   }
// };






