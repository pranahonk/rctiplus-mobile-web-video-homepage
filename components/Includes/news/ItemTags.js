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

const ItemTags = ({item, index, ...props}) => {
  const [endChild, setEndChild] = useState(false);
  const [list, setList] = useState([]);
  // useEffect(() => {
  //   if (endChild) {
  //     if (mockData.meta.page < mockData.meta.totalPage) {
  //       setMockData((mockData) => ({data: [...mockData.data, ...constMockApi2.data], meta: constMockApi2.meta}));
  //     }
  //   }
  // }, [endChild]);
  useEffect(() => {
    if (index < 4) {
      props.getListTag('covid-19').then((res) => setList(res.data)).catch((err) => console.log(err))
    }
  }, []);
  console.log(props)
  if (index < 4) {
    return (
        <li key={index} style={{border: 'none'}}>
          <span>{` ${index + 1}. #${item.tag} `}</span>
          <Swiper
          spaceBetween={10}
          width={242}
          height={140}
          onReachEnd={(swiper) => {
          setEndChild(swiper.isEnd);
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
          </Swiper>
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