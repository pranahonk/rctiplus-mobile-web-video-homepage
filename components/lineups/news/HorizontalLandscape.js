import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import queryString from 'query-string';
import {getTruncate} from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import { imageNews } from '../../../utils/helpers';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import { useQuery } from '@apollo/client';
import { GET_REGROUPING } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/trending.scss';

const TopicLoader = dynamic(() => import('../../Includes/Shimmer/ListTagLoader'))
let count = 0;


const HorizontalLandscape = ({...props}) => {
  const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [list, setList] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false)
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    console.log(data?.mock_news_regroupings);
    console.log(data?.mock_news_regroupings?.data);
    if(data?.mock_news_regroupings){
      setList(data?.mock_news_regroupings?.data);
    }
    const query = queryString.parse(window.location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
    else{
      count++;
    }
  },[data]);
  useEffect(() => {
    if (list.data && (list?.meta?.pagination?.current_page < list?.meta?.pagination?.total_page) && show && list.data.length < 20) {
      setLoadingMore(true)
    }
  }, [show])
  const assetUrl = list.meta && list.meta.assets_url ? list.meta.assets_url : null;
  const _goToDetail = (article) => {
    let category = ''
    if (article.subcategory_name.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    return ('/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
  }
  return (
    <li className="regroupping-by-section">
      {!isEmpty(props.article?.section) && (
        <h2 className="section-h2">{props.article?.section?.name}</h2>
      )}
      <ul style={{paddingLeft: 0}}>
        <li style={{border: 'none'}}>
          {list.length === 0 ? (<TopicLoader />) : (<Swiper
            spaceBetween={10}
            width={320}
            height={140}
            onReachEnd={setShow}
          >
            {data?.mock_news_regroupings?.data?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link href={_goToDetail(item)}  >
                    <div className="news-interest_thumbnail-wrapper">
                      {
                        imageNews(item.title, item.cover, item.image, 320, assetUrl, 'thumbnail')
                      }
                      <div className="news-interest_thumbnail-title" >
                        <h1>{getTruncate(item.title, '...', 100)}</h1>
                        <h2>{item.subcategory_name} | {item.source} | <span>{formatDateWordID(new Date(item.pubDate * 1000))}</span></h2>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
            {loadingMore && (
              <SwiperSlide>
                <TopicLoader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default HorizontalLandscape;
