import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { client } from '../../../graphql/client';


//import scss
import '../../../assets/scss/components/hot-competitions.scss';


import { GET_HOT_COMPETITIONS_UPDATE } from '../../../graphql/queries/competitions';
import { imageHotProfile } from '../../../utils/helpers';
import BottomScrollListener from 'react-bottom-scroll-listener';

const Loader = dynamic(() => import('../../Includes/Shimmer/hotCompetitionsLoader.js'));


const LandscapeHotCompetition = ({ title, indexTag, id, data }) => {
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
  }, []);

  const getHastagPagination = (page) => {
    client.query({ query: GET_HOT_COMPETITIONS_UPDATE(page, 5, id)})
      .then((res) => {
        setHastags((list)=>({...list, data: [...list.data, ...res.data?.lineup_contents?.data]}))
        setMeta(res.data?.lineup_contents?.meta);
        setAssetUrl(res.data?.lineup_contents?.meta?.image_path);
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err) => {
        console.log(err);
      });
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
  }, [show]);

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

  const _goToDetail = (article) => {
    return window.location.href = article;
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
            <div ref={scrollRef} className="lineup-containers">
              {hastags?.data.map((item, i) => {
                return (
                  <div
                    onClick={() => _goToDetail(item?.content_type_detail?.detail?.data?.permalink)}
                    key={`${i}-portrait-video`}
                    className="lineup-contents">
                    <div className="hot-competitions">
                      <button className="hot-competitions__button">
                        JOIN
                      </button>
                      {
                        imageHotProfile(item?.content_type_detail?.detail?.data?.title, item?.content_type_detail?.detail?.data?.thumbnail, item?.content_type_detail?.detail?.data?.thumbnail, 200, 112, assetUrl, 'thumbnail')
                      }
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

export default LandscapeHotCompetition;
