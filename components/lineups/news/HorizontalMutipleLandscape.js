import React, { useEffect, useState, useRef } from 'react';
import { getTruncate, imageHotProfile } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import { imageNews } from '../../../utils/helpers';
import dynamic from 'next/dynamic';
import {client }  from "../../../graphql/client"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import { GET_REGROUPING, GET_REGROUPING_LINEUPS } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/horizontal-multiple.scss';
import '../../../assets/scss/components/trending_v2.scss';
import Router from 'next/router';
import Cookie from 'js-cookie';

const Loader = dynamic(() => import('../../Includes/Shimmer/HorizontalMutipleLandscapeloader.js'));

//import redux
import newsCountView from '../../../redux/actions/newsCountView';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import Views from '@material-ui/icons/RemoveRedEyeSharp';


const HorizontalMutipleLandscape = ({title, indexTag, id, data, ...props}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [item, setItem] = useState([]);
  const [itemDimensional, setItemDimensional] = useState([]);
  const [assetUrl, setAssetUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
    setMeta(data?.lineup_type_detail?.detail?.meta);
    setItem(data?.lineup_type_detail?.detail);
  },[]);

  const getLineupsMultiplePagination = (page, page_size) =>{
    client.query({query: GET_REGROUPING_LINEUPS(page, page_size, id)})
      .then((res)=>{
        setMeta(res?.data?.lineup_news_regroupings?.meta);
        setItem((list) => ({...list, data: [...list.data, ...res.data.lineup_news_regroupings.data], meta: { ...list.meta }}));
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

  useEffect(()=>{
    const result = [];
    for (let i = 0; i < item?.data?.length; i += 3) {
      result.push(item?.data?.slice(i, i + 3));
    }

    setItemDimensional(result);

  }, [item]);

  useEffect(() => {
    if (meta?.pagination && show) {
      setLoadingMore(true);
      if(meta?.pagination?.current_page < meta?.pagination?.total_page){
        getLineupsMultiplePagination(meta?.pagination?.current_page + 1, 6, id);
      }
      else{
        setLoadingMore(false);
        setShow(null);
      }
    }
  }, [show]);

  const _goToDetail = (article) => {
    return window.location.href = article.permalink;
  };


  return (
    itemDimensional?.length === 0 || itemDimensional === undefined ?(<Loader />) :
      <div
        id="lineup-portrait"
        onTouchStart={e => onTouchStart(e)}
        onTouchEnd={e => onTouchEnd(e)}
        className="lineup_panels">
        <h2 className="content-title">
          {itemDimensional?.length < 1 ? null : title}
        </h2>
        <BottomScrollListener offset={40} onBottom={()=> setShow(true)}>
          {scrollRef => (
            <div ref={scrollRef} className="lineup-containers">
              {itemDimensional.map((list, index) => {
                return (
                  <div key={index} id={`multiple-${index}`}>
                    {
                      list.map((data, index2) =>{
                        return(
                          <div key={index2} className={`list_tags_thumb tagsItems`}>
                            <div className="lt_img">
                              <div className="lt_img_wrap">
                                <a onClick={(e) => {
                                  e.preventDefault();
                                  _goToDetail(data);
                                }}>
                                  {
                                    imageNews(data.title, data.cover, data.image, 200, assetUrl, 'news-interest_thumbnail')
                                  }
                                </a>
                              </div>
                            </div>
                            <div className="lt_content">
                              <a onClick={(e) => {
                                e.preventDefault();
                                _goToDetail(data);
                              }}>
                                <h2 dangerouslySetInnerHTML={{ __html: getTruncate(data.title, '...', 100)}}></h2>
                              </a>
                              <div className="lt_content-info">
                                <h5>{data.source}</h5>
                                <h6>{formatDateWordID(new Date(data.pubDate * 1000))}</h6>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                );
              })}
            </div>
          )}
        </ BottomScrollListener>
      </div>
  );
};


export default connect(state => state, {
  ...newsCountView
})(HorizontalMutipleLandscape);

