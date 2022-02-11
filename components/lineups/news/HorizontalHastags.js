import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { client } from '../../../graphql/client';


// Import Swiper React components

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/horizontal-hastags.scss';
import { GET_HASTAGS_PAGINATION } from '../../../graphql/queries/hastags';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import newsCountViewTag from '../../../redux/actions/newsCountView';
import BottomScrollListener from 'react-bottom-scroll-listener';

const Loader = dynamic(() => import('../../Includes/Shimmer/HastagLoader'));


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

  let swipe = {};

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    swipe = {x: touch.clientX};
  };

  const onTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const absX = Math.abs(touch.clientX - swipe.x);
    // if (absX > 50) {
    //   homeGeneralClicked('mweb_homepage_scroll_horizontal');
    // }
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
    hastags?.data?.length < 1 ? (<div />) :
      hastags?.data?.length === 0 || hastags?.data === undefined ?(<Loader />) :
        <div
          onTouchStart={e => onTouchStart(e)}
          onTouchEnd={e => onTouchEnd(e)}
          className="lineup_panels">
          <h2 className="content-title">
            {hastags?.data.length < 1 ? null : title}
          </h2>
          <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
            {scrollRef => (
              <div ref={scrollRef} className="lineup-containers-news-multiple">
                {hastags?.data.map((item, index) => {
                  return (
                    <Link href={_goToDetail(item)} key={index} id={`hastgas-${index}`}>
                      <a onClick={() => sendAnalytics(item)}>
                        <div className="horizontal-tags">
                          <span className="horizontal-tags_text">#{item.tag}</span>
                        </div>
                      </a>
                    </Link>
                  )
                })
                }

              </div>
            )}
          </ BottomScrollListener>
        </div>
  );
};


export default connect(state => state, {
  ...newsCountViewTag,
})(HorizontalHastags);

