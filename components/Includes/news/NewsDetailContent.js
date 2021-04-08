import React, { useEffect, useState } from 'react';
import {useRouter, withRouter} from 'next/router'
import { getTruncate, imageNews } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import queryString from 'query-string';
import '../../../assets/scss/components/trending_v2.scss';
import newsv2Actions from '../../../redux/actions/newsv2Actions';
import {connect} from "react-redux";
import {NEWS_API_V2} from "../../../config";
import { getNewsTokenV2 } from '../../../utils/cookie';
import axios from 'axios';

const redirectToPublisherIndex = [0, 1];

const useFetch = (id, item) => {
  const [response, setResponse] = useState([] );
  const [newContent, setNewContent]  = useState(null);
  useEffect( () => {
    async function fetchData(){
      const result =  await axios.get(`${NEWS_API_V2}/api/v1/readalso/${id}?page=1&pageSize=2`,{
        headers: {
          'Authorization': getNewsTokenV2(),
        },
      });
      await setResponse(result.data.data);
      const paragraph = item.content.split('<p>');
      const addRead = `<p>Baca juga: ${response.length > 0 ? response[0].title : null}</p>`;
      paragraph.splice(paragraph.length - 2, 0, addRead);
      paragraph.splice( 0, 1);
      setNewContent(paragraph);
    }
    fetchData();
  }, []);
  return {response};
};

export default function NewsDetailContent({item, indexKey, isIndexKey}) {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  const {response, newContent} = useFetch(item.id, item,{});



  useEffect(  () => {
    const query = queryString.parse(location.search);

    if (query.token || query.platform) {
      setAccessToken(query.token);
      setPlatform(query.platform);
    }

    // for (let i = 0; i < paragraph.length  ; i++) {
    //   if(paragraph[i] === "" || paragraph[i] === " "){
    //     paragraph.splice(i, 1)
    //   }else {
    //     paragraph[i]+= '<p>';
    //   }
    //
    //   console.log(paragraph[i]);
    // }
    // setNewContent(paragraph)

  },[response]);

  const _goToDetail = (article) => {
    let category = ''
    if (article.subcategory_name.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    if(isIndexKey) {
      if ((redirectToPublisherIndex.indexOf(indexKey) != -1) && platform !== 'ios') {
        return window.open(article.link, '_blank');
      }
      return router.push(`/news/detail/${category}/${article.id}/${encodeURI(urlRegex(article.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`);
    }
    else {
      return router.push(`/news/detail/${category}/${article.id}/${encodeURI(urlRegex(article.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`);
    }
  };

  if(response.length > 0){
    const paragraph = item.content.split('<p>');
    const addRead = `<p>Baca juga: ${response.length > 0 ? response[0].title : null}</p>`;
    paragraph.splice(paragraph.length - 2, 0, addRead);
    // for (let i = 0; i < paragraph.length  ; i++) {
    //   if(paragraph[i] === "" || paragraph[i] === " "){
    //     paragraph.splice(i, 1)
    //   }else {
    //     paragraph[i]+= '<p>';
    //   }
    //
    //   console.log(paragraph[i]);
    // }
    // setNewContent(paragraph)
  }

  const paragraph = item.content.split('<p>');
  const addRead = `<p>Baca juga: ${response.length > 0 ? response[0].title : null}</p>`;
  paragraph.splice(paragraph.length - 2, 0, addRead);
  paragraph.splice(0, 1);




  return(
    <div>
      <div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${response.length > 0 ? paragraph : item.content}` }}></div>
    </div>
  )
}
