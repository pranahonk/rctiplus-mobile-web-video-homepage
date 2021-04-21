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



  const rmAttributes = item.content.replace(/(class|id|style)="\w+"/gm, '').replace(/\s*>/gmi, '>').replace(/(<!--\s*([a-zA-Z0-9_ ]*)\s*-->)/gm, '');
  const countTag = {};
  if(rmAttributes.match(/(<\w+>)/gm) && rmAttributes.match(/(<\w+>)/gm).length > 0){
      rmAttributes.match(/(<\w+>)/gm).forEach(function(i) { countTag[i] = (countTag[i]||0) + 1;});
  }

  const getTag = rmAttributes.match(/(<\w+>)/gm) ? Object.keys(countTag).find(key => countTag[key] === Math.max.apply(null, Object.values(countTag))) : null;
  const excludedTag = ['<ul>', '<li>', '<strong>', '<a>'];
  const getParagraphLength = rmAttributes.replace(new RegExp(excludedTag.indexOf(getTag) > -1 ? null : getTag,"gi"), `++#${getTag}`).split("++#").filter((x)=> x);
  // console.log(getParagraphLength)
  const index = [];
  const paragraph = [];
  getParagraphLength.filter((x, i)=> {
    const length = x.replace(/<\w+>|<\/\w+>/gmi, '').trim().length;
    if(length === 0){
      index.push(i)
    }
  });

  let emptyTag = 0;
  for (let i = 0; i < getParagraphLength.length; i++) {
    if(i === index[emptyTag]){
      emptyTag !== index.length ? emptyTag++ : emptyTag+=0;
    }else{
      paragraph.push(getParagraphLength[i]);
    }
  }



  const total  = paragraph.length > 6 ? Math.floor(paragraph.length / 4) : 1;
  const {response, newContent} = useFetch(item.id, total);



  useEffect(  () => {
    const query = queryString.parse(location.search);

    if (query.token || query.platform) {
      setAccessToken(query.token);
      setPlatform(query.platform);
    }

  },[]);


  const newCont = (responses) => {
    const addReadArray = [];

    for (const response of responses) {
      let category = '';
      if (response.subcategory_name.length < 1) {
        category = 'berita-utama';
      } else {
        category = urlRegex(response.subcategory_name);
      }

      const addRead = ReactDOMServer.renderToStaticMarkup(<div className={"position-relative"} style={{marginBottom: "1rem"}}><div className={"content-trending-detail-baca-juga"}></div> <div className={"content-trending-detail-baca-content"}><span className={"font-weight-bold"}>Baca juga:</span><br /> <a href={`/news/detail/${category}/${response.id}/${encodeURI(urlRegex(response.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`} dangerouslySetInnerHTML={{ __html: `${response.title}` }}></a></div></div>);
      addReadArray.push(addRead);
    }

    if(paragraph.length === 1){
      return paragraph[0];
    }
    else if(paragraph.length === 2 && addReadArray.length === 1){
      paragraph.splice(paragraph.length , 0, addReadArray[0]);
    }
    else if(paragraph.length >= 3 && paragraph.length <= 5 && addReadArray.length === 1){
      paragraph.splice(2, 0, addReadArray[0]);
    }
    else{
      let addReadArrayIndex = 0;
      let indexInserted = 5;
      for (let i = 1; i < paragraph.length; i++) {
        if(i === indexInserted && paragraph.length > indexInserted && addReadArray[addReadArrayIndex]){
          if(typeof paragraph[i - 1 + addReadArrayIndex] !== 'undefined'){
            paragraph.splice(i - 1 + addReadArrayIndex, 0, addReadArray[addReadArrayIndex]);
            indexInserted+=5;
            addReadArrayIndex+=1;
          }

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
