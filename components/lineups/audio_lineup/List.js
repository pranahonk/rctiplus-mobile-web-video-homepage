import React, {useState, useEffect} from "react";
import Img from "react-image";
import { connect } from "react-redux";
import useVideoLineups from "../../hooks/lineups/useVideoLineups";
import {client }  from "../../../graphql/client";
import "../../../assets/scss/components/audio-list.scss";
import { RESOLUTION_IMG } from "../../../config";
import { GET_AUDIO_LIST } from '../../../graphql/queries/audio-list';

function AudioList (props) {
    // const [ contents, setContents ] = useState(props.content);
    const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props);

    const [show, setShow] = useState(null);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
        client.query({query: GET_AUDIO_LIST(1, 100, 1, 20)})
            .then((response) => {
                setData(response.data.mock_audios.data);
                setMeta(response.data.mock_audios.meta);
                setAssetUrl('');
            })
    }, [])
    return (
        <div onTouchStart={e => onTouchStart(e)} onTouchEnd={e => onTouchEnd(e)} className="pnl-audio-list">
            <h2 className="content-title">Sports Podcast</h2>
            <div className="swipe-wrapper">
                {data.map((content, index) => (
                    <div className="background-horizontal" key={index}>
                        <Img className="podcast-img" alt={content.title} unloader={<img src={placeHolderImgUrl} />} loader={<img src={placeHolderImgUrl} />} src={[`${assetUrl}${content.image_name}`, placeHolderImgUrl]}/>
                        <div className="desc-menu-wrapper">
                            <span className="podcast-title">{content.title}</span>
                            <span className="podcaster-name">Roov Official</span>
                            <div className="buttons-wrapper">
                                <img src="audio-icons/bookmark-icon.svg"/>
                                <img src="audio-icons/share-icon.svg"/>
                                <img src="audio-icons/download-icon.svg"/>
                                <img src="audio-icons/delete-icon.svg"/>
                            </div>
                        </div>
                        <img src="audio-icons/play-button.svg"/>
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default AudioList