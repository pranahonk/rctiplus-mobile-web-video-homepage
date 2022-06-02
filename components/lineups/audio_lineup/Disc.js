import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import useVideoLineups from '../../hooks/lineups/useVideoLineups';
import { client } from '../../../graphql/client';
import '../../../assets/scss/components/audio-disc.scss';
import { GET_AUDIO_DISC } from '../../../graphql/queries/audio-disc';

function AudioDisc (props) {
    // const [ contents, setContents ] = useState(props.content)
    const { generateLink, onTouchStart, onTouchEnd } = useVideoLineups(props);

    const [show, setShow] = useState(null);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
        client.query({query: GET_AUDIO_DISC(1, 100, 1, 20)})
            .then((response) => {
                setData(response.data.mock_audios.data);
                console.log(response.data.mock_audios.data)
                setMeta(response.data.mock_audios.meta);
                setAssetUrl('');
            })
    }, [])

    return (
        <div onTouchStart={e => onTouchStart(e)} onTouchEnd={e => onTouchEnd(e)} className="pnl-audio-disc">
            <h2 className="content-title">Euro 2020 Music Playlist</h2>
            <div className="swipe-wrapper">
                {data.map((content, index) => (
                    <div className="background-vertical" key={index}>
                        <div className="background-disc">
                            <Img className="disc-img" alt={content?.title} unloader={<img src={placeHolderImgUrl} />} loader={<img src={placeHolderImgUrl} />} src={[`${assetUrl}${content?.image_name}`, placeHolderImgUrl]}/>
                            <div className="disc-hole-background"></div>
                            <div className="disc-hole"></div>
                        </div>
                        <div className="listener-wrapper">
                            <img src="audio-icons/listener-icon.svg"/>
                            <span className="total-listener">{content.total_plays}</span>
                        </div>
                        <span className="playlist-name">Jazz</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AudioDisc
