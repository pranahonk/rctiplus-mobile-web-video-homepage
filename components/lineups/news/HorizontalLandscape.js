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
import { GET_REGROUPING, GET_REGROUPING_HASTAGS, GET_REGROUPING_LINEUPS } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/horizontal-landscape.scss';
import { GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';

const HorizontalLandspaceLoader = dynamic(() => import('../../Includes/Shimmer/HorizontalLandspaceLoader'))


const HorizontalLandscape = ({title, indexTag, id}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [list, setList] = useState([]);
  const [assetUrl, setAssetUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    client.query({query: GET_REGROUPING(1,20)})
      .then((res)=>{
        setList(res?.data?.lineups?.data[indexTag]?.lineup_type_detail.detail);
        setMeta(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail?.meta);
        setAssetUrl(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail?.meta?.image_path );
      })
      .catch((err)=>{
        console.log(err);
      });
  },[]);

  const getLineupsPagination = (page, page_size, id) =>{
    client.query({query: GET_REGROUPING_LINEUPS(page, page_size, id)})
      .then((res)=>{
        console.log(res?.data?.lineup_news_regroupings?.data);
        console.log(list?.data);
        setList((list)=> ({ ...list, data: [...list.data, ...res.data.lineup_news_regroupings.data]}))
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(() => {
    if (list?.data && show) {
      setLoadingMore(true);
      if(meta?.pagination?.current_page < meta?.pagination?.total_page){
        getLineupsPagination(list?.meta?.pagination?.current_page + 1, 10, id);
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
    return ('news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)));
  };
  return (
    list?.data?.length === undefined || list?.data?.length < 1 ? <div /> :
    <li className="regroupping-by-section">
      <h2 className="section-h2 mt-40 mb-2">{list?.data?.length ? title : null}</h2>
      <ul style={{paddingLeft: 0}}>
        <li style={{border: 'none'}}>
          {list?.data?.length === undefined || list?.data?.length < 1 ? (null) : (<Swiper
            spaceBetween={10}
            width={320}
            height={140}
            slidesPerView={1}
            onReachEnd={setShow}
          >
            {list?.data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link href={_goToDetail(item)}  >
                    <div className="regroupping-by-section_thumbnail-wrapper">
                      {
                        imageNews(item.title, item.cover, item.image, 320, assetUrl, 'thumbnail')
                      }
                      <div className="regroupping-by-section_thumbnail-title" >
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
                <HorizontalLandspaceLoader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default HorizontalLandscape;
