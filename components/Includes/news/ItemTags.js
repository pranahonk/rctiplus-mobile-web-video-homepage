import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Img from 'react-image';
import Link from 'next/link';
import queryString from 'query-string';
import { getTruncate } from '../../../utils/helpers';
// action
import newsAction from '../../../redux/actions/newsv2Actions';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

import TopicLoader from '../Shimmer/TopicLoader';

const ItemTags = ({item, index, ...props}) => {
  const [endChild, setEndChild] = useState(false);
  const [meta, setMeta] = useState([]);
  const [list, setList] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
    useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
  },[]);
  // useEffect(() => {
  //   if (endChild) {
  //     if (list.data) {
  //       list?.meta?.pagination?.current_page < list?.meta?.pagination?.total_page ? 
  //       (props.getListTag(item.tag, list?.meta?.pagination?.current_page + 1).then((res) => {
  //         const resultRes = {...list, data: [...list.data, ...res.data.data], meta: res.data.meta}
  //         setList(resultRes)
  //       }).catch((err) => console.log(err))) : ''
  //     }
  //     // if (list.length > 0) {
  //     //   console.log([...list, ...list])
  //       // list?.meta?.pagination?.current_page < list?.meta?.pagination?.total_page ? 
  //       // (props.getListTag(item.tag).then((res) => setList([...list, ...list])).catch((err) => console.log(err))) : ''
  //     // }
  //   }
  // }, [endChild]);
  useEffect(() => {
    if (index < 4) {
      props.getListTag(item.tag).then((res) => setList(res.data)).catch((err) => console.log(err))
    }
  }, []);
  if (index < 4) {
    return (
        <li key={index} style={{border: 'none'}}>
          <span>{` ${index + 1}. #${item.tag} `}</span>
          {list.length === 0 ? (<TopicLoader />) : (<Swiper
          spaceBetween={10}
          width={242}
          height={140}
          onSwiper={(swiper) => console.log(swiper)}
          onReachEnd={(swiper) => {
            if (swiper.isEnd) {
              if (list.data) {
                list?.meta?.pagination?.current_page < list?.meta?.pagination?.total_page ? 
                (props.getListTag(item.tag, list?.meta?.pagination?.current_page + 1).then((res) => {
                  setList((list) => ({...list, data: [...list.data, ...res.data.data], meta: res.data.meta}))
                }).catch((err) => console.log(err))) : ''
              }
            }
          //   swiper.isEnd ? setEndChild(swiper.isEnd)
          // setEndChild(swiper.isEnd);
          }}
          >
            {list?.data?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                <div className="news-interest_thumbnail-wrapper">
                  <Img
                    alt={'null'}
                    unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
                    loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
                    src={[item.cover, '/static/placeholders/placeholder_landscape.png']}
                    className="news-interest_thumbnail"
                    />
                  <div className="news-interest_thumbnail-title" >
                    <h1>{getTruncate(item.title, '...', 100)}</h1>
                    <h2>{item.subcategory_name} <span>Senin, 2 Ferbuari 2020 - 18:03</span></h2>
                  </div>
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>) }
        </li>
      );
  }
  return (<li key={index}>
    <Link href={`/news/topic/tag/${item.tag.toLowerCase()}${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`}>
      {` ${index + 1}. #${item.tag} `}
    </Link>
  </li>);
} 

const mapStateToProps = (state) => {
  return {
    listTopic: state.newsv2,
  };
}

export default connect(mapStateToProps, {...newsAction})(ItemTags);