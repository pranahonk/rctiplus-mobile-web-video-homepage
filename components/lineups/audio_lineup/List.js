import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import { client } from '../../../graphql/client';
import '../../../assets/scss/components/audio-list.scss';
import { GET_AUDIO_LIST } from '../../../graphql/queries/audio-list';

function AudioList ({title, indexTag, id, data}) {

    const [show, setShow] = useState(null);
    const [podcast, setPodcast] = useState([]);
    const [meta, setMeta] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "/static/placeholders/placeholder_square.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
      console.log(data?.lineup_type_detail?.detail)
      setMeta(data?.lineup_type_detail?.detail?.meta);
      setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
      setPodcast(data?.lineup_type_detail?.detail?.data);

        // client.query({query: GET_AUDIO_LIST(1, 100, 1, 20)})
        //     .then((response) => {
        //         setPodcast(response.data.mock_audios.data);
        //         setMeta(response.data.mock_audios.meta);
        //         setAssetUrl('');
        //     })
    }, [])


    return (
        <div>
          <h2 className="content-title">{title}</h2>
          <div className="swipe-wrapper">
            {podcast.map((content, index) => (
              <div className="background-horizontal" key={index}>
                <img src={`${assetUrl}${content?.content_type_detail?.detail?.data.image_banner}`} alt='test' />
                <Img className="podcast-img" alt={content?.content_type_detail?.detail?.data.title} unloader={<img src={`${assetUrl}${content?.content_type_detail?.detail?.data.image_banner}`} />} loader={<img src={placeHolderImgUrl} />} src={[`${assetUrl}${content.image_banner}`, placeHolderImgUrl]}/>
                <div className="desc-menu-wrapper">
                  <span className="podcast-title">{content?.content_type_detail?.detail?.data.title}</span>
                  <span className="podcaster-name">Roov Official</span>
                  <div className="buttons-wrapper">
                    <img src="audio-icons/share-icon.svg"/>
                    <img src="audio-icons/bookmark-icon.svg"/>
                    <img src="audio-icons/download-icon.svg"/>
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
