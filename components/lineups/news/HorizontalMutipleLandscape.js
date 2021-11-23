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
import { GET_REGROUPING } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/horizontal-multiple.scss';
import '../../../assets/scss/components/trending_v2.scss';

const Loader = dynamic(() => import('../../Includes/Shimmer/HorizontalMutipleLandscapeloader.js'))


const HorizontalMutipleLandscape = ({title, indexTag}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [item, setItem] = useState([]);
  const [assetUrl, setAssetUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    client.query({query: GET_REGROUPING(1,15)})
      .then((res)=>{
        const result = []
        // for (let i = 0; i < res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail.length; i += 3) {
        //   result.push(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail).slice(i, i + 3))
        // }
        // console.log(result)

        console.log(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
        setAssetUrl(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.meta?.image_path);
        setItem(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[item]);
  useEffect(() => {
    console.log(item);
    if (item?.data && (item?.meta?.pagination?.current_page < item?.meta?.pagination?.total_page) && show && item.data?.length < 20) {
      setLoadingMore(true);
    }
  }, [show, item]);

  const _goToDetail = (article) => {
    let category = '';
    if (article.subcategory_name?.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    return ('news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)));
  };
  return (
    <li>
      <h2 className="section-h2 mt-40 mb-2">{title}</h2>
      <ul style={{paddingLeft: 0}}>
        <li style={{border: 'none'}}>
          {item?.data?.length < 1  || item?.data === undefined? (<Loader />) : (<Swiper
            spaceBetween={10}
            width={320}
            height={140}
            slidesPerView={1}
          >
            {item?.data?.map((list, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className={`list_tags_thumb tagsItems`}>
                    <div className="lt_img">
                      <div className="lt_img_wrap">
                        <a onClick={(e) => {
                          e.preventDefault();
                          _goToDetail(list);
                        }}>
                          {
                            imageNews(list.title, list.cover, list.image, 200, assetUrl, 'news-interest_thumbnail')
                          }
                        </a>
                      </div>
                    </div>
                    <div className="lt_content">
                      <a onClick={(e) => {
                        e.preventDefault();
                        _goToDetail(list);
                      }}>
                        <h2 dangerouslySetInnerHTML={{ __html: getTruncate(list.title, '...', 100)}}></h2>
                      </a>
                      <div className="lt_content-info">
                        <h5>{list.source}</h5>
                        <h6>{formatDateWordID(new Date(list.pubDate * 1000))}</h6>
                      </div>
                    </div>
                  </div>
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
