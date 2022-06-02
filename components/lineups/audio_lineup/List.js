import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import '../../../assets/scss/components/audio-list.scss';
import { getTruncate } from '../../../utils/helpers';

function AudioList ({title, indexTag, id, data}) {

    const [show, setShow] = useState(null);
    const [podcast, setPodcast] = useState([]);
    const [multiplePodcast, setMultiplePodcast] = useState([]);
    const [meta, setMeta] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);

    const placeHolderImgUrl = "https://dev-radioplus.mncplus.com/image/no-image.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
      console.log(data?.lineup_type_detail?.detail)
      setMeta(data?.lineup_type_detail?.detail?.meta);
      setAssetUrl(data?.lineup_type_detail?.detail?.meta?.image_path);
      setPodcast(data?.lineup_type_detail?.detail?.data);
    }, [])

    useEffect(()=>{
      const result = [];
      for (let i = 0; i < podcast?.length; i += 3) {
        result.push(podcast?.slice(i, i + 3));
      }
      setMultiplePodcast(result);

    }, [podcast]);

    let indexId = 0;

    useEffect(()=>{
      console.log(multiplePodcast)
    }, [multiplePodcast])




    return (
        <div className="pnl-audio-list">
          <h2 className="content-title">
            {multiplePodcast?.length < 1 ? null : title}
          </h2>
          <div className="swipe-wrapper">
            {multiplePodcast.map((list, index) => {
              return (
                <div key={index}>
                  {
                    list.map((content, index2) =>{
                      indexId++;
                      return(
                        <div key={index2} id={`multiple-${indexId}`}>
                          <div className='background-horizontal'>
                            <div className='row mx-0'>
                              <div className='col-4'>
                                <Img className="podcast-img"
                                     alt={content?.content_type_detail?.detail?.data.name}
                                     unloader={<img src={`${assetUrl}${content?.content_type_detail?.detail?.data.image_banner}`} />}
                                     loader={<img src={placeHolderImgUrl} />}
                                     src={[`${assetUrl}${content.image_banner}`, placeHolderImgUrl]}
                                     width="100%"
                                     height="100%"
                                />
                              </div>
                              <div className='col-5 px-0'>
                                <div className="desc-menu-wrapper">
                                  <span className="podcast-title" dangerouslySetInnerHTML={{ __html: getTruncate(content?.content_type_detail?.detail?.data?.city, '...', 50)}}></span>
                                  <span className="podcaster-name" dangerouslySetInnerHTML={{ __html: getTruncate(content?.content_type_detail?.detail?.data?.name, '...', 40)}}></span>
                                  <div className="buttons-wrapper">
                                    <img src="audio-icons/share-icon.svg"/>
                                    <img src="audio-icons/bookmark-icon.svg"/>
                                    <img src="audio-icons/download-icon.svg"/>
                                  </div>
                                </div>
                              </div>
                              <div className='col-3'>
                                <img src="audio-icons/play-button.svg"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })}
          </div>
        </div>

    )
}

export default AudioList
