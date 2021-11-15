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
import '../../../assets/scss/components/horizontal-hastags.scss';
import { GET_HASTAGS } from '../../../graphql/queries/hastags';

const TopicLoader = dynamic(() => import('../../Includes/Shimmer/ListTagLoader'));


const HorizontalHastags = ({...props}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    client.query({query: GET_HASTAGS})
      .then((res)=>{
        console.log(res?.data?.mock_news_tagars);

        setHastags(res?.data?.mock_news_tagars);
        // setList(res?.data?.mock_news_regroupings?.data);
      })
      .catch((err)=>{
        console.log(err);
      });
  },[hastags]);
  useEffect(() => {
    if (hastags.data && (hastags?.meta?.pagination?.current_page < hastags?.meta?.pagination?.total_page) && show && hastags.data.length < 20) {
      setLoadingMore(true);
    }
  }, [show]);
  const _goToDetail = (article) => {
    return `news/topic/tag/${article.tag}`
  };

  return (
    <li>
      <h2 className="section-h2 mt-40 mb-2">Popular Topics</h2>
      <ul style={{paddingLeft: 10}}>
        <li style={{border: 'none'}}>
          {hastags.length === 0 ? (<TopicLoader />) : (<Swiper
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
