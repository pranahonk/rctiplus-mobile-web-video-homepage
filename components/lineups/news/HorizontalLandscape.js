import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { getTruncate, imageNews } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import dynamic from 'next/dynamic';
import { client } from '../../../graphql/client';


// Import Swiper React components

// Import Swiper styles
import 'swiper/swiper.scss';
import { GET_REGROUPING_LINEUPS } from '../../../graphql/queries/regrouping';

//import scss
import '../../../assets/scss/components/horizontal-landscape.scss';

//import redux
import newsCountView from '../../../redux/actions/newsCountView';
import Cookie from 'js-cookie';
import BottomScrollListener from 'react-bottom-scroll-listener';

const Loader = dynamic(() => import('../../Includes/Shimmer/HorizontalLandspaceLoader'))


const HorizontalLandscape = ({title, indexTag, id, data, ...props}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [list, setList] = useState([]);
  const [assetUrl, setAssetUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setList(data?.lineup_type_detail.detail);
    setMeta(data?.lineup_type_detail?.detail?.meta);
    setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path );
  },[]);

  const getLineupsPagination = (page, page_size, id) =>{
    client.query({query: GET_REGROUPING_LINEUPS(page, page_size, id)})
      .then((res)=>{
        setList((list)=> ({ ...list, data: [...list.data, ...res.data.lineup_news_regroupings.data]}))
        setMeta(res?.data?.lineup_news_regroupings?.meta);
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(() => {
    if (list?.data && show) {
      setLoadingMore(true);
      if(meta?.pagination?.current_page < meta?.pagination?.total_page){
        getLineupsPagination(meta?.pagination?.current_page + 1, 30, id);
      } else{
        setLoadingMore(false);
        setShow(null);
      }
    }
  }, [show]);

  const _goToDetail = (article) => {
    return article.permalink
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

  const sendAnalytics = (article) => {
    if(!Cookie.get('uid_ads')) {
      Cookie.set('uid_ads', new DeviceUUID().get())
    }
    else{
      props.newsCountViewDetail(Cookie.get('uid_ads'), article.id)
    }
  }
  return (
    list.data?.length < 1 ? (<div />) :
      list.data?.length === 0 || list.data?.length === undefined ?(<Loader />) :
        <div
          onTouchStart={e => onTouchStart(e)}
          onTouchEnd={e => onTouchEnd(e)}
          className="lineup_panels">
          <h2 className="content-title">
            {list.data?.length < 1 ? null : title}
          </h2>
          <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
            {scrollRef => (
              <div ref={scrollRef} className="lineup-containers-news-multiple">
                {list.data?.map((item, index) => {
                  return (
                    <div key={index} id={`horizontal-${index}`}>
                      <Link href={_goToDetail(item)}>
                        <a onClick={() => sendAnalytics(item)}>
                          <div className="regroupping-by-section_thumbnail-wrapper">
                            {
                              imageNews(item.title, item.cover, item.image, 320, assetUrl, 'thumbnail')
                            }
                            <div className="regroupping-by-section_thumbnail-title" >
                              <h1>{getTruncate(item.title, '...', 90)}</h1>
                              <h2>{item.subcategory_name} | {item.source} | <span>{formatDateWordID(new Date(item.pubDate * 1000))}</span></h2>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
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
  ...newsCountView
})(HorizontalLandscape);
