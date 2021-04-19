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
      const result =  await axios.get(`${NEWS_API_V2}/api/v1/readalso/${id}?page=1&pageSize=${total}`,{
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

  const rmAttributes = item.content.replace(/(class|id)="\w+"/gm, '').replace(/\s*>/gmi, '>').replace(/(<!--\s*([a-zA-Z0-9_ ]*)\s*-->)/gm, '');
  const getTag = rmAttributes.match(/(<\w+>)/gm) ? rmAttributes.match(/(<\w+>)/gm)[0]: null;
  const paragraph = rmAttributes.replace(new RegExp(getTag,"gi"), `#${getTag}`).split("#").filter((x)=> x);
  const index = []
  paragraph.filter((x, i)=> {
    const length = x.replace(/<\w+>|<\/\w+>/gmi, '').trim().length;
    if(length === 0){
      index.push(i)
    }
  });
  for (const p of index){
    if(p === paragraph.length){
      paragraph.splice(-p, 1)
    }else{
      paragraph.splice(p, 1)
    }
  }

  const total  = paragraph.length > 6 ? Math.floor(paragraph.length / 5) : 1;
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

    if(paragraph.length === 1){
      return paragraph[0];
    }
    else if(paragraph.length === 2 && addReadArray.length === 1){
      paragraph.splice(paragraph.length , 0, addReadArray[0]);
    }
    else if(paragraph.length >= 3 && paragraph.length <= 6 && addReadArray.length === 1){
      paragraph.splice(2, 0, addReadArray[0]);
    }
    else{
      let addReadArrayIndex = 0;
      let indexInserted = 3;
      for (let i = 1; i < paragraph.length; i++) {
        if(i === indexInserted && paragraph.length > indexInserted && addReadArray[addReadArrayIndex]){
          paragraph.splice(i -1 + addReadArrayIndex, 0, addReadArray[addReadArrayIndex]);
          indexInserted+=5;
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
