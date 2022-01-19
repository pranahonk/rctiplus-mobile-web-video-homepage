import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { client } from '../../../graphql/client';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/hot-competitions.scss';
import { GET_HASTAGS, GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';
import { GET_HOT_COMPETITIONS } from '../../../graphql/queries/competitions';
import { imageHot, imageNews } from '../../../utils/helpers';

const Loader = dynamic(() => import('../../Includes/Shimmer/hotCompetitionsLoader.js'));


const LandscapeHotCompetition = ({ title, indexTag, id, data }) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);

  useEffect(() => {
    setMeta(data?.lineup_type_detail?.detail?.meta);
    setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
    setHastags(data?.lineup_type_detail?.detail?.data);
  }, []);

  const getHastagPagination = (page) => {
    client.query({ query: GET_HOT_COMPETITIONS(1, 100, page, 5) })
      .then((res) => {
        if(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.data){
          setHastags((list) => ([...list, ...res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.data]));
        }
        setAssetUrl(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.meta?.image_path);
        setMeta(res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.meta);
        setLoadingMore(false);
        setShow(null);
        // setHastags((list) => ({...list, data: [...list, ...res?.data?.lineups?.data[indexTag].lineup_type_detail?.detail?.data]}))
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (hastags && show && meta) {
      setLoadingMore(true);
      if (meta?.pagination) {
        if (meta?.pagination?.current_page < meta?.pagination?.total_page) {
          getHastagPagination(meta?.pagination?.current_page + 1);
        } else {
          setLoadingMore(false);
          setShow(null);
        }
      } else {
        getHastagPagination(2);
      }

    }
  }, [show]);

  const _goToDetail = (article) => {
    return window.location.href = article;
  };

  return (
    <li className='regroupping-by-section'>
      <h2 className='section-h2 mt-40 mb-2'>{title}</h2>
      <ul style={{ paddingLeft: 10 }}>
        <li style={{ border: 'none' }}>
          {hastags?.length === 0 || hastags?.length === undefined ? (<Loader />) : (<Swiper
            spaceBetween={10}
            height={150}
            width={192}
            onReachEnd={setShow}
          >
            {hastags?.map((item, index) => {
              return (
                <SwiperSlide key={index} id={`hot-competitions-${index}`}>
                  <div className='hot-competitions'
                       onClick={() => _goToDetail(item?.content_type_detail?.detail?.data?.permalink)}>
                    {
                      item?.content_type_detail?.detail?.data?.thumbnail.includes('https') ?
                        imageHot(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail, item?.content_type_detail?.detail?.data?.thumbnail, 200, 112, assetUrl, 'thumbnail')
                        :
                        imageNews(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail, item?.content_type_detail?.detail?.data?.thumbnail, 200, assetUrl, 'thumbnail')
                    }
                    <button className='hot-competitions__button'>
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
          </Swiper>)}
        </li>
      </ul>
    </li>
  );
};

export default LandscapeHotCompetition;
