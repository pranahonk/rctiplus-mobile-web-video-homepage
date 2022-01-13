import React from "react";
import ax from 'axios';
import {DEV_API} from "../config";
import {checkToken, getCookie, getVisitorToken} from "./cookie";


let userId = null;

const axios = ax.create({ baseURL: DEV_API + '/api' });
axios.interceptors.request.use(async (request) => {
  await checkToken();
  const accessToken = getCookie('ACCESS_TOKEN');
  request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
  return request;
});

axios.get(`/v3/user`, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then((response)=>{
    userId = response.data.data.id;
  })
  .catch((err)=>{
    userId = "";
  })


export const gaTracker = (event_category = "string", event_action = "string", event_label = "string", pilar = "video") => {
  if (typeof window !== 'undefined' &&  userId !== null) {
    window.dataLayer.push({
      'pillar' : pilar,
      'event':'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label':  event_label,
      'user_id' : userId,
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
    });
  }
}


export const gaTrackerSearch = (event_category = "string", event_action = "string", event_label = "string") => {
  if (typeof window !== 'undefined' &&  userId !== null) {
    window.dataLayer.push({
      'pillar' : 'general',
      'event':'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label':  event_label,
      'user_id' : userId,
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
    });
  }
}

export const gaTrackerBanner = (
  event_category = "string",
  event_action = "string",
  event_label = "string",
  bannerId, program_id, content_type) => {
  if (typeof window !== 'undefined' &&  userId !== null) {
    window.dataLayer.push({
      'pillar' : 'general',
      'event':'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label':  event_label,
      'user_id' : userId,
      'date_time': new Date().toISOString(),
      'client_id': process.env.GA_360_USERID,
      'banner_id': "not_available",
      'banner_name': "not_available",
      'content_id': "not_available",
      'content_name': "not_available",
      'content_type': content_type,
      'content_category': "not_available",
      'program_id': program_id,
      'program_name': "not_available",
      'competition_id': "not_available",
      'competition_name': "not_available",
      'publisher_id': "not_available",
      'publisher_name': "not_available",
      'channel_owner_id': "not_available",
      'channel_owner': "not_available",
      'classification_id': "not_available",
      'classification': "not_available",
    });
  }
}


export const gaTrackerHeadline = (event, event_category, event_action, event_label, content_id, article_name, article_publisher_id, article_publisher_country, article_publisher_name, author, upload_date, publish_date, destination_url, canal, news_category, topic_hashtag, position) => {
  if (typeof window !== 'undefined') {
    if(event === "promotion_view"){
      window.dataLayer.push({
        'event': event,
        'event_category': event_category,
        'event_action': event_action,
        'event_label': event_label,
        'user_id' : userId,
        'client_id': process.env.GA_360_USERID,
        'content_id' : content_id,
        'article_name' : article_name,
        'article_publisher_id' : article_publisher_id,
        'article_publisher_country' : article_publisher_country,
        'article_publisher_name' : article_publisher_name,
        'author' : author,
        'upload_date' :upload_date,
        'publish_date' :publish_date,
        'sub_canal': 'not_available',
        'canal': canal,
        'news_category': news_category,
        'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
        'news_content_type' : 'article',
        'share_type' : 'not_available',
        'share_link' : 'not_available',
        'ecommerce': {
          'promoView': {
            'promotions': [
              {
                'id': content_id,
                'name': article_name,
                'creative': destination_url,
                'position': `${position}_${canal}`
              }]
          }
        }
      })
    }
    else{
      window.dataLayer.push({
        'event': event,
        'event_category': event_category,
        'event_action': event_action,
        'event_label': event_label,
        'user_id' : userId,
        'client_id': process.env.GA_360_USERID,
        'content_id' : content_id,
        'article_name' : article_name,
        'article_publisher_id' : article_publisher_id,
        'article_publisher_country' : article_publisher_country,
        'article_publisher_name' : article_publisher_name,
        'author' : author,
        'upload_date' :upload_date,
        'publish_date' :publish_date,
        'sub_canal': 'not_available',
        'canal': canal,
        'news_category': news_category,
        'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
        'news_content_type' : 'article',
      })
    }
  }
}

export const gaTrackerTopic = (event_category, event_action, event_label, canal, topic_hashtag) => {
  if (typeof window !== 'undefined') {
    window.dataLayer.push({
      'pillar' : 'news',
      'event':'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label':  event_label,
      'user_id' : userId,
      'client_id': process.env.GA_360_USERID,
      'topic_hashtag' : topic_hashtag ? topic_hashtag : "not_available",
      'canal': canal
    });
  }
};

export const gaTrackerShareButton = (event, event_category, event_action, event_label, content_id, article_name, article_publisher_id, article_publisher_country, article_publisher_name, author, upload_date, publish_date, destination_url, canal, news_category, topic_hashtag, share_type, share_link) => {
  if (typeof window !== 'undefined') {
    if(event === "promotion_view"){
      window.dataLayer.push({
        'event': event,
        'event_category': event_category,
        'event_action': event_action,
        'event_label': event_label,
        'user_id' : userId,
        'client_id': process.env.GA_360_USERID,
        'content_id' : content_id,
        'article_name' : article_name,
        'article_publisher_id' : article_publisher_id,
        'article_publisher_country' : article_publisher_country,
        'article_publisher_name' : article_publisher_name,
        'author' : author,
        'upload_date' :upload_date,
        'publish_date' :publish_date,
        'sub_canal': 'not_available',
        'news_category': news_category,
        'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
        'news_content_type' : 'article',
        'share_type' : share_type,
        'share_link' : share_link,
        'ecommerce': {
          'promoView': {
            'promotions': [
              {
                'id': content_id,
                'name': article_name,
                'creative': destination_url,
                'position': canal
              }]
          }
        }
      })
    }
    else{
      window.dataLayer.push({
        'event': event,
        'event_category': event_category,
        'event_action': event_action,
        'event_label': event_label,
        'user_id' : userId,
        'client_id': process.env.GA_360_USERID,
        'content_id' : content_id,
        'article_name' : article_name,
        'article_publisher_id' : article_publisher_id,
        'article_publisher_country' : article_publisher_country,
        'article_publisher_name' : article_publisher_name,
        'author' : author,
        'upload_date' :upload_date,
        'publish_date' :publish_date,
        'sub_canal': 'not_available',
        'news_category': news_category,
        'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
        'news_content_type' : 'article',
        'share_type' : share_type,
        'share_link' : share_link,
      })
    }

  }

};

export const gaTrackerBackDetail = (event_category, event_action, event_label, canal, topic_hashtag, content_id, article_name, article_publisher_id, article_publisher_country, article_publisher_name) => {
  if (typeof window !== 'undefined') {
    window.dataLayer.push({
      'pillar' : 'news',
      'event':'general_event',
      'event_category': event_category,
      'event_action': event_action,
      'event_label':  event_label,
      'user_id' : userId,
      'client_id': process.env.GA_360_USERID,
      'content_id' : content_id,
      'article_name' : article_name,
      'article_publisher_id' : article_publisher_id,
      'article_publisher_country' : article_publisher_country,
      'article_publisher_name' : article_publisher_name,
      'news_content_type' : 'article',
      'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
    });
  }
};


export const gaTrackerWithoutEvent = (content_id, article_name, article_publisher_id, article_publisher_country, article_publisher_name, author, upload_date, publish_date, destination_url, canal, news_category, topic_hashtag) => {
  if (typeof window !== 'undefined') {
    window.dataLayer.push({
      'user_id' : userId,
      'client_id': process.env.GA_360_USERID,
      'content_id' : content_id,
      'article_name' : article_name,
      'article_publisher_id' : article_publisher_id,
      'article_publisher_country' : article_publisher_country,
      'article_publisher_name' : article_publisher_name,
      'author' : author,
      'upload_date' :upload_date,
      'publish_date' :publish_date,
      'sub_canal': 'not_available',
      'canal': canal,
      'news_category': news_category,
      'topic_hashtag': topic_hashtag ? topic_hashtag : "not_available",
      'news_content_type' : 'article',
    })
  }
}

export const gaTrackerWithoutEventFunc = (article) => {
  gaTrackerWithoutEvent(
    article.id,
    article.title,
    article.country_id,
    article.country_name,
    article.source,
    article.author,
    article.created_at,
    article.publish_date,
    article.share_link,
    article.subcategory_name,
    article.subcategory_name,
    article.tags.substring(1),
  )
}


export const gaTrackerHeadlineFunc = (article, event,eventCategory, eventAction, position, eventLabel) =>{
  gaTrackerHeadline(
    event,
    eventCategory,
    eventAction,
    eventLabel ? eventLabel : article.title,
    article.id,
    article.title,
    article.country_id,
    article.country_name,
    article.source,
    article.author,
    article.created_at,
    article.publish_date,
    article.share_link,
    article.subcategory_name,
    article.subcategory_name,
    article.tags.substring(1),
    position)
}

