import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import useVideoLineups from '../../hooks/lineups/useVideoLineups';
import { client } from '../../../graphql/client';
import '../../../assets/scss/components/audio-disc.scss';
import { GET_AUDIO_DISC } from '../../../graphql/queries/audio-disc';

function AudioDisc ({title, indexTag, id, data}) {
    console.log(title);
    console.log(indexTag);
    console.log(id);
    console.log(data?.lineup_type_detail?.detail?.data);
    // const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props);

    const [show, setShow] = useState(null);
    const [meta, setMeta] = useState([]);
    const [disc, setDisc] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
      console.log(data?.lineup_type_detail?.detail?.meta?.image_path);
      setMeta(data?.lineup_type_detail?.detail?.meta);
      setAssetUrl("https://static.roov.id/upload/200");
      setDisc(data?.lineup_type_detail?.detail?.data);
    }, [])

    useEffect(()=>{
      console.log(disc)
    }, [disc])



    return (
        <div onTouchStart={e => onTouchStart(e)} onTouchEnd={e => onTouchEnd(e)} className="pnl-audio-disc">
            <h2 className="content-title">{title}</h2>
            <div className="swipe-wrapper">
                {disc.map((content, index) => {
                  console.log(content)
                  return (
                    <div className="background-vertical" key={index}>
                      <div className="background-disc">
                        <img   alt={content?.content_type_detail?.detail?.data?.title} src={`${assetUrl}${content?.content_type_detail?.detail?.data?.image_banner}`} alt={content?.content_type_detail?.detail?.data?.title} />
                        <Img className="disc-img"
                             alt={content?.content_type_detail?.detail?.data?.title}
                             unloader={<img src={[`${assetUrl}${content?.content_type_detail?.detail?.data?.image_banner}`, placeHolderImgUrl]} />}
                             loader={<img src={[`${assetUrl}${content?.content_type_detail?.detail?.data?.image_banner}`, placeHolderImgUrl]} />}
                             src={[`${assetUrl}${content?.content_type_detail?.detail?.data?.image_banner}`, placeHolderImgUrl]}/>
                        <div className="disc-hole-background"></div>
                        <div className="disc-hole"></div>
                      </div>
                      <div className="listener-wrapper">
                        <img src="audio-icons/listener-icon.svg"/>
                        <span className="total-listener">{content.total_plays}</span>
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
