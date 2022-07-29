import React, { useEffect, useState } from 'react';
import Img from 'react-image';
import '../../../assets/scss/components/audio-list.scss';
import { getTruncate, truncateString } from '../../../utils/helpers';
import Router from 'next/router';
import ActionSheet from '../../Modals/ActionSheet';


//import bottom screen listener
import BottomScrollListener from 'react-bottom-scroll-listener';
import { client } from '../../../graphql/client';
import { GET_AUDIO_LIST_PAGINATION } from '../../../graphql/queries/audio-list';

function AudioList ({title, indexTag, id, data}) {

    const [show, setShow] = useState(false);
    const [podcast, setPodcast] = useState([]);
    const [multiplePodcast, setMultiplePodcast] = useState([]);
    const [meta, setMeta] = useState(null);
    const [actionSheet, setActionSheet] = useState(false);
    const [assetUrl, setAssetUrl] = useState(null);
    const [shareUrl, setShareURL] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

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

    useEffect(() => {
      if (meta?.pagination && show) {
        setLoadingMore(true);

        if(meta?.pagination?.current_page < meta?.pagination?.total_page){
          getPaginationPotraitDisc(meta?.pagination?.current_page + 1, 5, id);
        }
        else{
          setLoadingMore(false);
          setShow(null);
        }
      }
    }, [show]);

  const getPaginationPotraitDisc = async (page, page_size, id) =>{
    client.query({query: GET_AUDIO_LIST_PAGINATION(page, page_size, id)})
      .then((res)=>{
        setMeta(res?.data?.lineup_contents?.meta);
        setPodcast((list) => ([...list, ...res?.data?.lineup_contents?.data]));
        setLoadingMore(false);
        setShow(null);
      })
      .catch((err)=>{
        console.log(err);
      });
  };

    let indexId = 0;

    const _goToDetail = (content) => {
      Router.push(content?.content_type_detail?.detail?.data?.permalink)
    }

    const toggleActionSheet = (program = null, caption = '', url = '', hashtags = []) => {
      setActionSheet((e) => !e);
      setShareURL(url)
    }

    const getImage = (url, staticPath) => {
      if (url){
        return  `${staticPath}/200/${url}`
      }
      else{
        return "http://www.roov.id/image/logo.png"
      }
    }


    return (
      multiplePodcast === undefined || multiplePodcast.length < 1 ?   (<div />) :
        <div className="pnl-audio-list">
          <h2 className="content-title">
            {multiplePodcast?.length === 0 ? null : title}
          </h2>
          <ActionSheet
            caption={"saksian roov di rcti+"}
            path={window.location.href}
            url={shareUrl}
            open={actionSheet}
            hashtags={["test", ""]}
            toggle={()=> toggleActionSheet(this, null, '', '', ['rcti'])}
          />
          <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
            {scrollRef => (
              <div ref={scrollRef} className="swipe-wrapper">
                {multiplePodcast.map((list, index) => {
                  return (
                    <div key={index} id={`square-list-${index}`}>
                      {
                        list.map((content, index2) =>{
                          indexId++;
                          if(content?.content_type_detail?.detail?.status?.code !== 0){
                            setShow(false)
                          }

                          return(
                            <div key={index2}>
                              <div className='background-horizontal'>
                                <div className='row mx-0'>
                                  <div className='col-4 podcast-wrapper'>
                                    <Img className="podcast-img"
                                         alt={content?.content_type_detail?.detail?.data.name}
                                         unloader={<img src={`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`} />}
                                         loader={<img src={[`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`]} />}
                                         src={[`${getImage(content?.content_type_detail?.detail?.data?.portrait_image, content?.content_type_detail?.detail?.meta?.assets_url)}`]}
                                         width="76"
                                         height="76"
                                    />
                                  </div>
                                  <div className='col-5 px-0'>
                                    <div className="desc-menu-wrapper">
                                      <span className="podcast-title" dangerouslySetInnerHTML={{ __html: truncateString(content?.content_type_detail?.detail?.data?.title, 10)}}></span>
                                      <span className="podcaster-name" dangerouslySetInnerHTML={{ __html: getTruncate(content?.content_type_detail?.detail?.data?.frequency, '...', 40)}}></span>
                                      <div className="buttons-wrapper">
                                        <img src="audio-icons/share-icon.svg"  width="16.67" height="13.33" className="mr-3" onClick={()=> toggleActionSheet(this, null, content?.content_type_detail?.detail?.data?.permalink, '', ['rcti'])} />
                                        {/*<img src="audio-icons/bookmark-icon.svg" className="mx-3" />*/}
                                        {/*<img src="audio-icons/download-icon.svg" onClick={() => alertDownload(null, 'extra', null, null, null)}/>*/}
                                        (
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-3' style={{margin: 'auto 0'}}>
                                    <img src="audio-icons/play-button.svg" width="33" height="33" onClick={()=> _goToDetail(content)}/>
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
            )}
          </BottomScrollListener>
        </div>

    )
}

export default AudioList
