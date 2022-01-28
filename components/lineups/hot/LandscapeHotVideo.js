import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {client }  from "../../../graphql/client"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

//import scss
import '../../../assets/scss/components/hot-video.scss';
import { getTruncate, imageHot, imageHotProfile } from '../../../utils/helpers';
import {
  GET_HOT_VIDEO_PAGINATIONS_UPDATE,
} from '../../../graphql/queries/hot-video';
import Views from '@material-ui/icons/RemoveRedEyeSharp';

const Loader = dynamic(() => import('../../Includes/Shimmer/hotVideoLoader'));


const LandscapeHotVideo = ({title, indexTag, id, data}) => {
  // const {data, loading } = useQuery(GET_REGROUPING);

  const [show, setShow] = useState(null);
  const [hastags, setHastags] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);

  useEffect(() => {
    setMeta(data?.lineup_type_detail?.detail?.meta);
    setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
    setHastags(data?.lineup_type_detail?.detail);
  },[]);

  const getHastagPagination = (page) =>{
    client.query({query: GET_HOT_VIDEO_PAGINATIONS_UPDATE(page, 5, id)})
      .then((res)=>{
        setMeta(res?.data?.lineup_contents?.meta);
        setHastags((list) => ({...list, data: [...list.data, ...res?.data?.lineup_contents?.data]}));
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

  useEffect(() => {
    if (hastags && show && meta) {
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
      return window.location.href = article
  };

  return (
    <li className="regroupping-by-section list-unstyled">
      <h2 className="section-h2 mt-40 mb-2">{title}</h2>
      <ul style={{paddingLeft: 10}}>
        <li style={{border: 'none'}}>
          {hastags?.data?.length === 0 || hastags?.data?.length === undefined ? (<Loader />) : (<Swiper
            spaceBetween={10}
            height={150}
            width={192}
            onReachEnd={setShow}
          >
            {hastags?.data.map((item, index) => {
              return (
                <SwiperSlide key={index} id={`video-${index}`}>
                  <div className="hot-videos" onClick={()=>{_goToDetail(item?.content_type_detail?.detail?.data?.permalink)}}>
                    {
                      imageHotProfile(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail,item?.content_type_detail?.detail?.data?.thumbnail, 175,220, assetUrl, 'thumbnail')
                    }
                    <div className="hot-videos_card">
                      <div className="hot-videos_card-profile">
                        <div className="hot-videos_card-profile__image">
                          <img src="/static/HOT+ White-01.png" alt='Gambar HOT+' />
                        </div>
                        <div className='row'>
                          <div className="hot-videos_card-profile__photo col-3">
                            {
                              imageHotProfile(item?.content_type_detail?.detail?.data?.id, item?.content_type_detail?.detail?.data?.contestant?.thumbnail,assetUrl, 20,152, assetUrl, '')
                            }
                          </div>
                          <div className="hot-videos_card-profile__name col">
                            {getTruncate(item?.content_type_detail?.detail?.data?.contestant?.display_name || item?.content_type_detail?.detail?.data?.contestant?.nick_name ||  item?.content_type_detail?.detail?.data?.contestant?.email || item?.content_type_detail?.detail?.data?.contestant?.phone_number, "...", "17")}
                          </div>
                        </div>
                        <div className='row'>
                          <div className="hot-videos_card-profile__views col-3">
                            <Views style={{ fontSize: '1.5rem', color: "white" }} />
                          </div>
                          <div className="hot-videos_card-profile__viewsCount col">
                            {item?.content_type_detail?.detail?.data?.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            {loadingMore && (
              <SwiperSlide>
                <Loader />
              </SwiperSlide>)}
          </Swiper>) }
        </li>
      </ul>
    </li>
  );
};

export default LandscapeHotVideo;
