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
import ReactDOMServer from 'react-dom/server';

const redirectToPublisherIndex = [0, 1];

const useFetch = (id, total) => {
  const [response, setResponse] = useState([] );
  const [newContent, setNewContent]  = useState(null);
  useEffect( () => {
    async function fetchData(){
      const result =  await axios.get(`${NEWS_API_V2}/api/v1/readalso/${id}?page=1&pageSize=3`,{
        headers: {
          'Authorization': getNewsTokenV2(),
        },
      });
      await setResponse(result.data.data);
    }
    fetchData();
  }, []);

  return {response, newContent};
};

export default function NewsDetailContent({item, indexKey, isIndexKey}) {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);

  const getTag =  item.content.match(/(<\w+>)/gm)[0];
  const paragraph = item.content.replace(new RegExp(getTag,"gi"), `#${getTag}`).split("#");
  const total  = paragraph.length - 1 > 6 ? Math.floor(paragraph.length / 3) : 1;
  const {response, newContent} = useFetch(item.id, total);


  useEffect(  () => {
    const query = queryString.parse(location.search);

    if (query.token || query.platform) {
      setAccessToken(query.token);
      setPlatform(query.platform);
    }

  },[]);


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


  const newCont = (responses) => {
    const getTag =  item.content.match(/(<\w+>)/gm)[0];
    const paragraph = item.content.replace(new RegExp(getTag,"gi"), `#${getTag}`).split("#");
    paragraph.splice(0, 1);

    const addReadArray = [];

    for (const response of responses) {
      let category = '';
      if (response.subcategory_name.length < 1) {
        category = 'berita-utama';
      } else {
        category = urlRegex(response.subcategory_name);
      }

      for (let i = 0; i < paragraph.length; i++) {
        if(paragraph[i].match(/(<a href)/gm)){
          paragraph.splice(i, 1);
        }
      }
      const addRead = ReactDOMServer.renderToStaticMarkup(<p> Baca juga: <a href={`/news/detail/${category}/${response.id}/${encodeURI(urlRegex(response.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`}>{response.title }</a></p>);
      addReadArray.push(addRead);
    }

    if(paragraph.length - 1 === 1){
      return false;
    }
    else if(paragraph.length - 1 === 2 && addReadArray.length === 1){
      paragraph.splice(paragraph.length - 1, 0, addReadArray[0]);
    }
    else if(paragraph.length - 1 >= 3 && paragraph.length - 1 <= 6 && addReadArray.length === 1){
      paragraph.splice(2, 0, addReadArray[0]);
    }
    else{
      let addReadArrayIndex = 0;
      for (let i = 0; i < paragraph.length; i++) {
        if(i % 3 === 0 && i !== 0){
          paragraph.splice(i - 1, 0, addReadArray[addReadArrayIndex]);
          addReadArrayIndex+=1;
        }
      }
    }

    return paragraph.join('');
  }


  return(
    <div>
      <div className="content-trending-detail-text" dangerouslySetInnerHTML={{ __html: `${response && response.length > 0 ? newCont(response) : item.content}` }}></div>
    </div>
  )
}
