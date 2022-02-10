import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { client } from '../../../graphql/client';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/horizontal-hastags.scss';
import { GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import newsCountViewTag from '../../../redux/actions/newsCountView';
import Img from 'react-image';
import { RESOLUTION_IMG } from '../../../config';

const HastagLoader = dynamic(() => import('../../Includes/Shimmer/HastagLoader'));


const HorizontalHastags = ({title, indexTag, id, data, ...props}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setHastags(data?.lineup_type_detail?.detail);
  },[]);

  const getHastagPagination = (page) =>{
    client.query({query: GET_HASTAGS_PAGINATION(id, page, 6)})
      .then((res)=>{
        setHastags((list) => ({...list, data: [...list.data, ...res.data.lineup_news_tagars.data]}))
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

  const sendAnalytics = (article) => {
    if(!Cookie.get('uid_ads')) {
      Cookie.set('uid_ads', new DeviceUUID().get())
    }
    else{
      const params = {
        'tag': article.tag,
      };

      props.newsCountViewTag(JSON.parse(params))
    }
  }

  return (
    <li className="regroupping-by-section list-unstyled">
      <h2 className="section-h2 mt-40 mb-2">{title}</h2>
      <ul style={{paddingLeft: 0, marginBottom: 0}}>
        <li style={{border: 'none'}}>
          {hastags?.data?.length === 0 || hastags?.data?.length === undefined ? (<HastagLoader />) : (<Swiper
            spaceBetween={10}
            height={150}
            width={180}
            onSlideChange={setShow}
          >
            {hastags?.data.map((item, index) => {
              return (
                  <SwiperSlide key={index} id={`hastgas-${index}`}>
                    <Link href={_goToDetail(item)}>
                      <a onClick={() => sendAnalytics(item)}>
                        <div className="horizontal-tags">
                          <span className="horizontal-tags_text">#{item.tag}</span>
                        </div>
                      </a>
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


export default connect(state => state, {
  ...newsCountViewTag,
})(HorizontalHastags);

