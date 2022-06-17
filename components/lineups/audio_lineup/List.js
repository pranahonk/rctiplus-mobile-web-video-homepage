import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import '../../../assets/scss/components/audio-list.scss';
import { getTruncate } from '../../../utils/helpers';
import { alertDownload } from '../../Includes/program-detail/programDetail';
import Router from 'next/router';
import ActionSheet from '../../Modals/ActionSheet';

function AudioList ({title, indexTag, id, data}) {

    const [show, setShow] = useState(true);
    const [podcast, setPodcast] = useState([]);
    const [multiplePodcast, setMultiplePodcast] = useState([]);
    const [meta, setMeta] = useState([]);
    const [actionSheet, setActionSheet] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);
    const [shareUrl, setShareURL] = useState(null)

    const placeHolderImgUrl = "https://dev-radioplus.mncplus.com/image/no-image.png"
    // const rootImageUrl = `${props.imagePath}${RESOLUTION_IMG}`

    useEffect(() => {
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

    const _goToDetail = (content) => {
      Router.push(content?.content_type_detail?.detail?.data?.permalink)
    }

    const toggleActionSheet = (program = null, caption = '', url = '', hashtags = []) => {
      setActionSheet((e) => !e);
      setShareURL(url)
    }


    return (
      multiplePodcast === undefined || multiplePodcast.length < 1 || !show ?   (<div />) :
        <div className="pnl-audio-list">
          <h2 className="content-title">
            {multiplePodcast?.length < 1 ? null : title}
          </h2>
          <ActionSheet
            caption={"saksian roov di rcti+"}
            path={window.location.href}
            url={shareUrl}
            open={actionSheet}
            hashtags={["test", "anyinggg"]}
            toggle={()=> toggleActionSheet(this, null, '', '', ['rcti'])}
          />
          <div className="swipe-wrapper">
            {multiplePodcast.map((list, index) => {
              return (
                <div key={index}>
                  {
                    list.map((content, index2) =>{
                      indexId++;
                      if(content?.content_type_detail?.detail?.status?.code !== 0){
                          setShow(false)
                      }
                      return(
                        <div key={index2} id={`multiple-${indexId}`}>
                          <div className='background-horizontal'>
                            <div className='row mx-0'>
                              <div className='col-4 my-auto'>
                                <Img className="podcast-img"
                                     alt={content?.content_type_detail?.detail?.data.name}
                                     unloader={<img src={`${content?.content_type_detail?.detail?.meta?.assets_url}/${content?.content_type_detail?.detail?.data?.image_banner}`} />}
                                     loader={<img src={[`${content?.content_type_detail?.detail?.meta?.assets_url}/${content?.content_type_detail?.detail?.data?.image_banner}`]} />}
                                     src={[`${content?.content_type_detail?.detail?.meta?.assets_url}/${content?.content_type_detail?.detail?.data?.image_banner}`]}
                                     width="76"
                                     height="76"
                                />
                              </div>
                              <div className='col-5 px-0'>
                                <div className="desc-menu-wrapper">
                                  <span className="podcast-title" dangerouslySetInnerHTML={{ __html: getTruncate(content?.content_type_detail?.detail?.data?.name, '...', 50)}}></span>
                                  <span className="podcaster-name" dangerouslySetInnerHTML={{ __html: getTruncate(content?.content_type_detail?.detail?.data?.frequency, '...', 40)}}></span>
                                  <div className="buttons-wrapper">
                                    <img src="audio-icons/share-icon.svg"  className="mr-3" onClick={()=> toggleActionSheet(this, null, content?.content_type_detail?.detail?.data?.permalink, '', ['rcti'])} />
                                    {/*<img src="audio-icons/bookmark-icon.svg" className="mx-3" />*/}
                                    <img src="audio-icons/download-icon.svg" onClick={() => alertDownload(null, 'extra', null, null, null)}/>
                                    (
                                  </div>
                                </div>
                              </div>
                              <div className='col-3' style={{margin: 'auto 0'}}>
                                <img src="audio-icons/play-button.svg" onClick={()=> _goToDetail(content)}/>
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
