import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Img from 'react-image';
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
  console.log(list)
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
                console.log(list)
                list?.meta?.pagination?.current_page < list?.meta?.pagination?.total_page ? 
                (props.getListTag(item.tag, list?.meta?.pagination?.current_page + 1).then((res) => {
                  const resultRes = {...list, data: [...list.data, ...res.data.data], meta: res.data.meta}
                  setList(resultRes)
                }).catch((err) => console.log(err))) : ''
              }
            }
            console.log('Reach end: ', swiper)
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
  return (<li key={index}>{` ${index + 1}. #${item.tag} `}</li>);
} 

const mapStateToProps = (state) => {
  return {
    listTopic: state.newsv2,
  };
}

export default connect(mapStateToProps, {...newsAction})(ItemTags);