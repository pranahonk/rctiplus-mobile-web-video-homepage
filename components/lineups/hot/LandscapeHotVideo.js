import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {client} from '../../../graphql/client';


// Import Swiper React components
// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/hot-video.scss';

//import helper
import { getTruncate, imageHot, imageHotProfile } from '../../../utils/helpers';
import {GET_HOT_VIDEO_PAGINATIONS_UPDATE} from '../../../graphql/queries/hot-video';
import Views from '@material-ui/icons/RemoveRedEyeSharp';
import BottomScrollListener from 'react-bottom-scroll-listener';

const Loader = dynamic(() => import('../../Includes/Shimmer/hotVideoLoader'));


const LandscapeHotVideo = ({title, indexTag, id, data}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);
  const placeHolderImgUrl = '/static/placeholders/placeholder_potrait.png';

  useEffect(() => {
    setMeta(data?.lineup_type_detail?.detail?.meta);
    setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
    setHastags(data?.lineup_type_detail?.detail);
  },[]);

  const getHastagPagination = (page) =>{
    client.query({query: GET_HOT_VIDEO_PAGINATIONS_UPDATE(page, 5, id)})
      .then((res) => {
        setMeta(res?.data?.lineup_contents?.meta);
        setHastags((list) => ({...list, data: [...list.data, ...res?.data?.lineup_contents?.data]}));
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err) => {
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
    if (hastags && show && meta) {
      setLoadingMore(true);
      if (meta?.pagination) {
        if (meta?.pagination?.current_page < meta?.pagination?.total_page) {
          getHastagPagination(meta?.pagination?.current_page + 1);
        } else {
          setLoadingMore(false);
          setShow(null);
        }
      } else {
        getHastagPagination(2);
      }

    }
  },[show]);

  const _goToDetail = (article) => {
      return window.location.href = article
  };


  return (
    hastags?.data?.length === 0 || hastags?.data?.length === undefined ? (<Loader />) :
    <div
      id="lineup-portrait"
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      className="lineup_panels">
      <h2 className="content-title">
        {title}
      </h2>
      <BottomScrollListener offset={40} onBottom={()=> setShow(true)}>
        {scrollRef => (
          <div ref={scrollRef} className="lineup-containers-hot">
            {hastags?.data.map((item, i) => {
              return (
                <div
                  onClick={() => _goToDetail(item?.content_type_detail?.detail?.data?.permalink)}
                  key={`${i}-portrait-video`}
                  className="lineup-contents">
                  <div className="hot-videos" id={`portrait-video-${i}`}>
                    {
                      imageHot(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail,item?.content_type_detail?.detail?.data?.thumbnail, 175,220, assetUrl, 'thumbnail')
                    }
                  </div>
                  <div>
                    <div className="hot-videos_card">
                      <div className="hot-videos_card-profile">
                        <div className="hot-videos_card-profile__image">
                          <img src="/static/HOT+ White-01.png" alt="Gambar HOT+"/>
                        </div>
                        <div className="row">
                          <div className="hot-videos_card-profile__photo col-3 pr-0">
                            {
                              imageHotProfile(item?.content_type_detail?.detail?.data?.id, item?.content_type_detail?.detail?.data?.contestant?.thumbnail, assetUrl, 20, 152, assetUrl, '')
                            }
                          </div>
                          <div className="hot-videos_card-profile__name col">
                            {getTruncate(item?.content_type_detail?.detail?.data?.contestant?.display_name || item?.content_type_detail?.detail?.data?.contestant?.nick_name || item?.content_type_detail?.detail?.data?.contestant?.email || item?.content_type_detail?.detail?.data?.contestant?.phone_number, '...', '15')}
                          </div>
                        </div>
                        <div className="row">
                          <div className="hot-videos_card-profile__views col-3">
                            <Views style={{fontSize: '1.5rem', color: 'white'}}/>
                          </div>
                          <div className="hot-videos_card-profile__viewsCount col">
                            {item?.content_type_detail?.detail?.data?.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ BottomScrollListener>
    </div>
  );
};

export default LandscapeHotVideo;
