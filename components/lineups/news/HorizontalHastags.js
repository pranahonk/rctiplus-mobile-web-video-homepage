import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {client }  from "../../../graphql/client"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/horizontal-hastags.scss';
import { GET_HASTAGS, GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';

const HastagLoader = dynamic(() => import('../../Includes/Shimmer/HastagLoader'));


const HorizontalHastags = ({title, indexTag, id}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    client.query({query: GET_HASTAGS(1, 100, 1, 100)})
      .then((res)=>{
        setHastags(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[]);

  const getHastagPagination = (page) =>{
    client.query({query: GET_HASTAGS_PAGINATION(id, page)})
      .then((res)=>{
        console.log(res);
        setHastags((list) => ({...list, data: [...list.detail.data, ...res.data.lineup_news_tagars.data]}))
        setMeta(res.data.lineup_news_tagars.meta);
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(() => {
    if (hastags.data && show) {
      setLoadingMore(true);
      if(meta?.pagination){
        if(meta?.pagination?.current_page < meta?.pagination?.total_page){
          getHastagPagination(meta?.pagination?.current_page + 1);
        }
        else{
          setLoadingMore(false);
          setShow(null);
        }
      }else{
        getHastagPagination(2);
      }

    }
  },[show]);

  const _goToDetail = (article) => {
    return `news/topic/tag/${article.tag}`
  };

  return (
    <li className="regroupping-by-section">
      <h2 className="section-h2 mt-40 mb-2">{title}</h2>
      <ul style={{paddingLeft: 10}}>
        <li style={{border: 'none'}}>
          {hastags?.data?.length === 0 || hastags?.data?.length === undefined ? (<HastagLoader />) : (<Swiper
            spaceBetween={10}
            height={150}
            width={180}
            onReachEnd={setShow}
          >
            {hastags?.data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link href={_goToDetail(item)}  >
                    <div className="horizontal-tags">
                      <span className="horizontal-tags_text">#{item.tag}</span>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
            {loadingMore && (
              <SwiperSlide>
                <HastagLoader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default HorizontalHastags;
