import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import queryString from 'query-string';
import { getTruncate } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import { imageNews } from '../../../utils/helpers';

// action
import newsAction from '../../../redux/actions/newsv2Actions';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

import TopicLoader from '../Shimmer/TopicLoader';

const ItemTags = ({...props}) => {
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
    console.log(props.idSection % 6)
    console.log(props.idSection)
    console.log(props.listTopic.data_section?.data[props.idSection])
    // props.getSectionArticle(props.listTopic.data_section?.data[props.idSection - 6], 6, 1)
  },[]);
  const _goToDetail = (article) => {
    let category = ''
    if (article.subcategory_name.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    return ('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
  }
    return (
        <ul>
            <li style={{border: 'none'}}>
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
            }}
            >
              {list?.data?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Link href={_goToDetail(item)}>
                      <div className="news-interest_thumbnail-wrapper">
                        {
                          imageNews(item.title, item.cover, item.image, 237, assetUrl, 'thumbnail')
                        }
                        <div className="news-interest_thumbnail-title" >
                          <h1>{getTruncate(item.title, '...', 100)}</h1>
                          <h2>{item.subcategory_name} <span>{formatDateWordID(new Date(item.pubDate * 1000))}</span></h2>
                        </div>
                      </div>
                    </Link>
                </SwiperSlide>
                );
              })}
            </Swiper>) }
          </li>
        </ul>
      );
} 

const mapStateToProps = (state) => {
  return {
    listTopic: state.newsv2,
  };
}

export default connect(mapStateToProps, {...newsAction})(ItemTags);