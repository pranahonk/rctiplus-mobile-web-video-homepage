import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {client }  from "../../../graphql/client"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/hot-competitions.scss';
import { GET_HASTAGS, GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';
import { GET_HOT_COMPETITIONS } from '../../../graphql/queries/competitions';
import { imageNews } from '../../../utils/helpers';

const Loader = dynamic(() => import('../../Includes/Shimmer/hotCompetitionsLoader.js'));


const LandscapeHotCompetition = ({title, indexTag, id, data}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);
  console.log(data)

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);

  useEffect(() => {
    client.query({query: GET_HOT_COMPETITIONS(1, 100, 1, 20)})
      .then((res)=>{
        setMeta(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.meta);
        setAssetUrl(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.meta?.image_path);
        setHastags(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[]);

  const getHastagPagination = (page) =>{
    client.query({query: GET_HOT_COMPETITIONS(1, 100, page, 20)})
      .then((res)=>{
        setAssetUrl(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.meta?.image_path);
        setHastags((list) => ({...list, data: [...list.data, ...res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail]}))
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(() => {
    if (hastags.data && show && meta) {
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
    return window.location.href = article
  };

  return (
    <li className="regroupping-by-section">
      <h2 className="section-h2 mt-40 mb-2">{title}</h2>
      <ul style={{paddingLeft: 10}}>
        <li style={{border: 'none'}}>
          {hastags?.data?.length === 0 || hastags?.data?.length === undefined ? (<Loader />) : (<Swiper
            spaceBetween={10}
            height={150}
            width={192}
            onReachEnd={setShow}
          >
            {hastags?.data?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="hot-competitions">
                    {
                      imageNews(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail,item?.content_type_detail?.detail?.data?.thumbnail, 200, assetUrl, 'thumbnail')
                    }
                    <button className="hot-competitions__button" onClick={()=> _goToDetail(item?.content_type_detail?.detail?.data?.permalink)}>
                      JOIN
                    </button>
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

export default LandscapeHotCompetition;
