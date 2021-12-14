import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import queryString from 'query-string';
import {getTruncate} from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import { imageNews } from '../../../utils/helpers';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import {client }  from "../../../graphql/client"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import { useQuery } from '@apollo/client';
import { GET_REGROUPING, GET_REGROUPING_LINEUPS } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/horizontal-multiple.scss';
import '../../../assets/scss/components/trending_v2.scss';
import Router from 'next/router';

const Loader = dynamic(() => import('../../Includes/Shimmer/HorizontalMutipleLandscapeloader.js'))


const HorizontalMutipleLandscape = ({title, indexTag, id}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [item, setItem] = useState([]);
  const [itemDimensional, setItemDimensional] = useState([]);
  const [assetUrl, setAssetUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    client.query({query: GET_REGROUPING(1,21)})
      .then((res)=>{
        setAssetUrl(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail?.meta?.image_path);
        setMeta(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail?.meta);
        setItem(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[]);

  const getLineupsMultiplePagination = (page, page_size) =>{
    client.query({query: GET_REGROUPING_LINEUPS(page, page_size, id)})
      .then((res)=>{
        setMeta(res?.data?.lineup_news_regroupings?.meta);
        setItem((list) => ({...list, data: [...list.data, ...res.data.lineup_news_regroupings.data], meta: { ...list.meta }}));
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(()=>{
    const result = [];
    for (let i = 0; i < item?.data?.length; i += 3) {
      result.push(item?.data?.slice(i, i + 3));
    }

    setItemDimensional(result);

  }, [item]);

  useEffect(() => {
    if (meta?.pagination && show) {
      setLoadingMore(true);
      if(meta?.pagination?.current_page < meta?.pagination?.total_page){
        getLineupsMultiplePagination(meta?.pagination?.current_page + 1, 15, id);
      }
      else{
        setLoadingMore(false);
        setShow(null);
      }
    }
  }, [show]);

  const _goToDetail = (article) => {
    let category = '';
    if (article.subcategory_name?.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    Router.push('news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)));
  };
  return (
    itemDimensional?.length === 0 || itemDimensional === undefined ? <div/> :
    <li>
      <h2 className="section-h2 mt-40 mb-2">{itemDimensional?.length < 1 ? null : title}</h2>
      <ul style={{paddingLeft: 10}}>
        <li style={{border: 'none'}}>
          {itemDimensional?.length === 0 || itemDimensional === undefined ? (null) : (<Swiper
            spaceBetween={10}
            width={320}
            height={140}
            slidesPerView={1}
            onReachEnd={setShow}
          >
            {itemDimensional.map((list, index) => {
              return (
                <SwiperSlide key={index}>
                  {
                    list.map((data, index2) =>{
                      return(
                        <div key={index2} className={`list_tags_thumb tagsItems`}>
                          <div className="lt_img">
                            <div className="lt_img_wrap">
                              <a onClick={(e) => {
                                e.preventDefault();
                                _goToDetail(data);
                              }}>
                                {
                                  imageNews(data.title, data.cover, data.image, 200, assetUrl, 'news-interest_thumbnail')
                                }
                              </a>
                            </div>
                          </div>
                          <div className="lt_content">
                            <a onClick={(e) => {
                              e.preventDefault();
                              _goToDetail(data);
                            }}>
                              <h2 dangerouslySetInnerHTML={{ __html: getTruncate(data.title, '...', 100)}}></h2>
                            </a>
                            <div className="lt_content-info">
                              <h5>{data.source}</h5>
                              <h6>{formatDateWordID(new Date(data.pubDate * 1000))}</h6>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }

                </SwiperSlide>
              );
            })}
            {loadingMore && (
              <SwiperSlide>
                <Loader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default HorizontalMutipleLandscape;
