import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import '../../../assets/scss/components/audio-disc.scss';
import { getTruncate } from '../../../utils/helpers';

//import bottom screen listener
import BottomScrollListener from 'react-bottom-scroll-listener';
import { client } from '../../../graphql/client';
import { GET_AUDIO_LIST_PAGINATION } from '../../../graphql/queries/audio-list';

function AudioDisc ({title, indexTag, id, data}) {
    // const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props)

    const [show, setShow] = useState(false);
    const [meta, setMeta] = useState(null);
    const [disc, setDisc] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"

    useEffect(() => {
      setMeta(data?.lineup_type_detail?.detail?.meta);
      setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
      setDisc(data?.lineup_type_detail?.detail?.data);
    }, [])

    useEffect(() => {
      if (meta?.pagination && show) {
        setLoadingMore(true);

        if(meta?.pagination?.current_page < meta?.pagination?.total_page){
          getPaginationSquareListMini(meta?.pagination?.current_page + 1, 5, id);
        }
        else{
          setLoadingMore(false);
          setShow(null);
        }
      }
    }, [show]);

  const getPaginationSquareListMini = (page, page_size, id) =>{
    client.query({query: GET_AUDIO_LIST_PAGINATION(page, page_size, id)})
      .then((res)=>{
        setMeta(res?.data?.lineup_contents?.meta);
        setDisc((list) => ([...list, ...res?.data?.lineup_contents?.data]));
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

    const _goToDetail = (article) => {
      return window.location.href = article?.permalink;
    };

    const getImage = (url, staticPath) => {
      if (url){
        return  `${staticPath}/200/${url}`
      }
      else{
        return "http://www.roov.id/image/logo.png"
      }
    }

    return (
      disc === undefined || disc.length < 1 ?   (<div />) :
        <div className="pnl-audio-disc">
            <h2 className="content-title">{title}</h2>
          <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
            {scrollRef => (
              <div ref={scrollRef} className="swipe-wrapper">
                {disc.map((content, index) => {
                  if(content?.content_type_detail?.detail?.status?.code !== 0){
                    setShow(false)
                  }
                  return (
                    <div className="background-vertical" id={`square-list-audio-${index}`} key={index}  onClick={()=> _goToDetail(content?.content_type_detail?.detail?.data)}>
                      <div className="background-disc">
                        <Img className="disc-img"
                             alt={content?.content_type_detail?.detail?.data?.title}
                             unloader={<img src={[`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`]} />}
                             loader={<img src={[`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`]} />}
                             src={[`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`]}/>
                        <div className="disc-hole-background"></div>
                        <div className="disc-hole"></div>
                      </div>
                      <div className="listener-wrapper">
                        {/*<img src="audio-icons/listener-icon.svg"/>*/}
                        {/*<span className="total-listener">{content?.content_type_detail?.detail?.data?.total_plays}</span>*/}
                      </div>
                      <span className="playlist-name">{getTruncate(content?.content_type_detail?.detail?.data?.title, '...', 10)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </BottomScrollListener>

        </div>
    )
}

export default AudioDisc
