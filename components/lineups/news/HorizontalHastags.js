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
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    client.query({query: GET_HASTAGS(1, 15)})
      .then((res)=>{
        setHastags(res?.data?.lineups?.data[indexTag]?.lineup_type_detail?.detail);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[]);
  useEffect(() => {
    console.log(show);
    if (hastags.data && show) {
      // client.query({query: GET_HASTAGS_PAGINATION(id)})
      //   .then((res)=>{
      //     console.log(res);
      //   })
      //   .catch((err)=>{
      //     console.log(err);
      //   });
      // hastags?.meta?.pagination?.current_page < hastags?.meta?.pagination?.total_page ?
      //   (props.getListTag(hastags.tag, hastags?.meta?.pagination?.current_page + 1).then((res) => {
      //     setShow(null)
      //     setList((list) => ({...list, data: [...list.data, ...res.data.data], meta: res.data.meta}))
      //   }).catch((err) => console.log(err))) : ''
    }
  },[show])
  useEffect(() => {
    if (hastags.data && (hastags?.meta?.pagination?.current_page < hastags?.meta?.pagination?.total_page) && show && hastags.data.length < 20) {
      setLoadingMore(true);
    }
  }, [show]);
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
                <TopicLoader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default HorizontalHastags;
