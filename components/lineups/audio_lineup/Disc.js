import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import '../../../assets/scss/components/audio-disc.scss';
import dynamic from 'next/dynamic';

const ActionSheet = dynamic(() => import('../../Modals/ActionSheet'), { ssr: false });

function AudioDisc ({title, indexTag, id, data}) {
    // const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props)

    const [show, setShow] = useState(null);
    const [meta, setMeta] = useState([]);
    const [disc, setDisc] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`
    //console.log(data?.lineup_type_detail?.detail)

    useEffect(() => {
      setMeta(data?.lineup_type_detail?.detail?.meta);
      // setAssetUrl("https://static.roov.id/upload/200/");

      setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
      setDisc(data?.lineup_type_detail?.detail?.data);
    }, [])

    const _goToDetail = (article) => {
      return window.location.href = article?.permalink;
    };



    return (
        <div className="pnl-audio-disc">
            <h2 className="content-title">{title}</h2>
            <div className="swipe-wrapper">
                {disc.map((content, index) => {
                  return (
                    <div className="background-vertical" key={index}  onClick={()=> _goToDetail(content?.content_type_detail?.detail?.data)}>
                      <div className="background-disc">
                        <Img className="disc-img"
                             alt={content?.content_type_detail?.detail?.data?.title}
                             unloader={<img src={[`${content?.content_type_detail?.detail?.meta?.assets_url}/200/${content?.content_type_detail?.detail?.data?.image_banner}`]} />}
                             loader={<img src={[`${content?.content_type_detail?.detail?.meta?.assets_url}/200/${content?.content_type_detail?.detail?.data?.image_banner}`]} />}
                             src={[`${content?.content_type_detail?.detail?.meta?.assets_url}/200/${content?.content_type_detail?.detail?.data?.image_banner}`]}/>
                        <div className="disc-hole-background"></div>
                        <div className="disc-hole"></div>
                      </div>
                      <div className="listener-wrapper">
                        <img src="audio-icons/listener-icon.svg"/>
                        <span className="total-listener">{content?.content_type_detail?.detail?.data?.total_plays}</span>
                      </div>
                      <span className="playlist-name">Jazz</span>
                    </div>
                  )
                })}
            </div>
        </div>
    )
}

export default AudioDisc
