import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Img from 'react-image';
import Router from 'next/router';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { TabPane } from 'reactstrap';
import { ButtonPrimary, ButtonOutline } from '../Common/Button';
import ShareIcon from '../IconCustom/ShareIcon';
import ThumbUpIcon, {ThumbUpIconSolid} from '../IconCustom/Actions';
import Dialog from '../../Modals/Dialog';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import GetApp from '@material-ui/icons/GetApp';
import { RESOLUTION_IMG } from '../../../config';
import { showAlert, showSignInAlert } from '../../../utils/helpers';
import { urlRegex } from '../../../utils/regex';
import CancelIcon from '@material-ui/icons/Cancel';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Modal } from 'reactstrap';
const TabPanelLoader = dynamic(() => import('../Shimmer/detailProgramLoader').then((mod) => mod.TabPanelLoader));
import smoothscroll from 'smoothscroll-polyfill';
import { isIOS } from 'react-device-detect';
import BottomScrollListener from 'react-bottom-scroll-listener';

import { 
  programRateEvent, programShareEvent, programContentShareEvent, 
  programAddMyListEvent, programContentAddMyListEvent, programContentDownloadEvent,
  programShowMoreEvent, programRelatedEvent, programSeasonCloseEvent, 
  programSeasonListEvent, programTabEvent, programContentEvent, 
  accountMylistContentClicked, accountMylistRemoveMylistClicked, 
  accountMylistShareClicked, accountMylistDownloadClicked, libraryProgramRateClicked, 
  libraryProgramShareClicked, libraryProgramTrailerClicked, libraryProgramAddMylistClicked, 
  libraryProgramContentDownloadClicked, libraryProgramContentAddMylistClicked, 
  libraryProgramContentShareClicked, libraryProgramContentClicked, libraryProgramTabClicked, libraryGeneralEvent, 
  libraryProgramSeasonListClicked, libraryProgramSeasonCloseClicked, searchProgramRateClicked, searchProgramShareClicked, 
  searchProgramTrailerClicked, searchProgramAddMyListClicked, searchProgramContentDownloadClicked, searchProgramContentAddMyListClicked,
  searchProgramContentShareClicked, searchProgramContentClicked, searchProgramTabClicked, searchProgramSeasonListClicked, 
  searchProgramSeasonCloseClicked, searchProgramRelatedScrollHorizontalEvent, searchProgramShowmoreClicked, programTrailerEvent, ProgramContentClick } from '../../../utils/appier';

const setActiveContentHighlight = (isContentActive) => {
  if (!isContentActive) return null
  
  const maskStyle = {
    width: "100%",
    position: "absolute",
    background: "#0000009e",
    borderRadius: "7px",
    height: "100%",
  }
  const spanStyle = {
    width: "100%",
    position: "absolute",
    background: "#05b5f585",
    borderRadius: "0 0 7px 7px",
    bottom: 0,
    padding: "0.2rem",
    textAlign: "center",
    color: "white",
  }
  
  return (
    <>
      <div style={maskStyle}></div>
      <span style={spanStyle}>Now Watching</span>
    </>
  )
}

export const PanelEpisode = forwardRef((props, ref) => {
  smoothscroll.polyfill();
  const linkRef = useRef(null);
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem, item) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'content_click_link', item, 'episode')
  };
  return (
      <TabPane tabId="Episodes">

        <BottomScrollListener offset={0} onBottom={props.onShowMore} />

        <div className="episode-program">
          <div className="season__program">
            <Dialog onclick={props.onSeason} selected={props.seasonSelected} dataTracking={props.dataTracking}/>
          </div>
          { props.data.data.map((item,i) => {
            return (
              <div key={i}>
                <div className="panel-content">
                  <div className="thumb-img__content" style={{ position: "relative"}}>
                    <Link
                      href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=episode&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                      as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/episode/${item.id}/${urlRegex(item.title)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`}>
                      <a onClick={() => link(item.title, item.id, 'episode', item.summary, item)} ref={linkRef}>
      
                        {setActiveContentHighlight(+props.isActive === +item.id)}

                        <Img
                          alt={item.title}
                          title={item.title}
                          className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
                          unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
                          loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
                      </a>
                    </Link>
                  </div>
                  <div className="thumb-detail__content">
                    <h3>{ `E${(item.episode < 10 ? '0'+item.episode : ''+item.episode).slice(0)}:S${(item.season < 10 ? '0'+item.season : ''+item.season).slice(0)} ${item.title}` }</h3>
                    <div className="action-button__content ">
                      { bookmark(props.bookmark && props.bookmark.data, item, 'episode', props, 'content_bookmark') }
                      <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title, item)}/>
                      <ButtonPrimary icon={ <GetApp/> } onclick={() => { alertDownload(item, 'episode', props.dataTracking.idContent, props.dataTracking.title , props.dataTracking.ref) }}/>
                    </div>
                  </div>
                </div>
              <div className="summary__content">
                <p>
                  { item.summary }
                </p>
              </div>
            </div>
            );
          }) }
        </div>

        {props.enableShowMore.isNext ? props.enableShowMore.isLoading ? (<TabPanelLoader />) : null : null}
      </TabPane>
  );
});

export const PanelExtra = (props) => {
  const linkExtraRef = useRef();
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem, item) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'content_click_link', item, 'extra')
  };
  return (
    <TabPane tabId="Extra">
      <BottomScrollListener offset={0} onBottom={props.onShowMore} />
      <div className="extra-program">
        { props.data.data.map((item,i) => {
          return (
            <div key={i}>
              <div className="panel-content">
                <div className="thumb-img__content" style={{ position: "relative"}}>
                  <Link
                    href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=extra&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                    as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/extra/${item.id}/${urlRegex(item.title)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`}>
                      <a onClick={() => link(item.title, item.id, 'extra', item.summary, item)} ref={linkExtraRef}>
                        
                        {setActiveContentHighlight(+props.isActive === +item.id)}

                        <Img
                          alt={item.title}
                          title={item.title}
                          className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
                          unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
                          loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
                      </a>
                    </Link>
                </div>
                <div className="thumb-detail__content">
                  <h3>{ item.title }</h3>
                  <div className="action-button__content ">
                      { bookmark(props.bookmark && props.bookmark.data, item, 'extra', props, 'content_bookmark') }
                      <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title, item)}/>
                      <ButtonPrimary icon={ <GetApp/> } onclick={() => { alertDownload(item, 'extra', props.dataTracking.idContent, props.dataTracking.title , props.dataTracking.ref) }}/>
                  </div>
                </div>
              </div>
              <div className="summary__content">
                <p>
                  { item.summary }
                </p>
              </div>
            </div>
          );
        }) }
      </div>

      {props.enableShowMore.isNext ? props.enableShowMore.isLoading ? (<TabPanelLoader />) : null : null}
    </TabPane>
  );
};

export const PanelClip = (props) => {
  const linkClipRef = useRef();
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem, item) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'content_click_link', item, 'clip')
  };
  return (
    <TabPane tabId="Clips">
      <BottomScrollListener offset={0} onBottom={props.onShowMore} />
      <div className="clip-program">
        { props.data.data.map((item,i) => {
          return (
            <div key={i}>
              <div className="panel-content">
                <div className="thumb-img__content" style={{ position: "relative"}}>
                  <Link
                    href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=clip&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                    as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/clip/${item.id}/${urlRegex(item.title)}${props.dataTracking.ref ? '?ref='+props.dataTracking.ref : ''}`}>
                    <a onClick={() => link(item.title, item.id, 'clip', item.summary, item)} ref={linkClipRef}>
                      
                      {setActiveContentHighlight(+props.isActive === +item.id)}
                      
                      <Img alt={item.title}
                        title={item.title}
                        className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
                        unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
                        loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
                    </a>
                    </Link>
                </div>
                <div className="thumb-detail__content">
                  <h3>{ item.title }</h3>
                  <div className="action-button__content ">
                    { bookmark(props.bookmark && props.bookmark.data, item, 'clip', props, 'content_bookmark') }
                    <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title, item)}/>
                    <ButtonPrimary icon={ <GetApp/> } onclick={() => { alertDownload(item, 'clip', props.dataTracking.idContent, props.dataTracking.title , props.dataTracking.ref) }}/>
                  </div>
                </div>
              </div>
              <div className="summary__content">
                <p>
                  { item.summary }
                </p>
              </div>
            </div>
          );
        }) }
      </div>

     {props.enableShowMore.isNext ? props.enableShowMore.isLoading ? (<TabPanelLoader />) : null : null}
    </TabPane>
  );
};

export const PanelPhoto = (props) => {
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  return (
    <TabPane tabId="Photo">
      <div className="photo-program">
        <div style={{ padding: '10px 0' }}>
          <div className="panel-content tab__photo">
          { props.data.data.map((item,i) => {
          return (
            <div key={i} className="thumb-img__content tab__photo-item" onClick={ () => { 
              
              Router.push(`/programs/${props.query.id}/${urlRegex(props.query.title)}/photo/${item.id}/${urlRegex(item.title)}`) 
              onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'photo', item)
              } }>
              <Img alt={item.title}
              title={item.title}
              className="tab__photo-item_img" src={[props.data.meta.image_path + RESOLUTION_IMG + item.photos[0].image, getPathImage(...pathImg,item.portrait_image, false, 'potrait')]}
              unloader={<img className="tab__photo-item_img" src={getPathImage(...pathImg,item.photos[0].image, false, 'potrait')}/>}
              loader={<img className="tab__photo-item_img" src={getPathImage(...pathImg,item.photos[0].image, false, 'potrait')}/>}/>
              <PhotoLibraryIcon className="img-icon"/>
            </div>
            );
          }) }
          </div>
        </div>
      </div>
      {/* {props.enableShowMore.isLoading ? (<TabPanelLoader />) : props.enableShowMore.isNext ? (
        <div style={{display: 'flex' ,justifyContent: 'center', width: '100%'}}>
          <ButtonOutline text="Show more" className="small-button" onclick={props.onShowMore}/>
        </div>
      ) : ''} */}
      {props.enableShowMore.isNext ? props.enableShowMore.isLoading ? (<TabPanelLoader />) : null : null}
    </TabPane>
  );
};

export const PanelRelated = (props) => {
  smoothscroll.polyfill();
  const handleOnScroll = useCallback((e) => {},[]);
  const containerRef = useBottomScrollListener(handleOnScroll);
  useEffect(() => {
    containerRef.current.addEventListener('scroll', () => {
      const scroll = Math.ceil(containerRef.current.scrollLeft);
      const max = (containerRef.current.scrollWidth - containerRef.current.clientWidth);
      if ((containerRef.current.scrollLeft === containerRef.current.scrollLeftMax) || scroll === max) {
        props.hasMore();
      }
    });
  },[]);
  const linkRef = useRef(null);
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (id, title) => {
    const href = `/programs?id=${id}&title=${title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`;
    const as = `/programs/${id}/${title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`;
    props.hasPlayer('data-player');
    Router.push(href,as);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="related__program-wrapper">
      <h4>Related Program</h4>
            <div ref={containerRef} className="related__program-list" onTouchStart={(e) => onTouchStart(e)} onTouchEnd={(e) => onTouchEnd(e, props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title)}>
              { props.data.data.map((item, i) => {
                return (
                  <Link key={i}
                        href={`/programs?id=${item.id}&title=${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                        as={`/programs/${item.id}/${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                  >
                    <a onClick={() => { link(item.id, item.title); }} ref={linkRef}>
                    <div className="related-item">
                      {item.premium ? (
                        <div className="paid-label">
                          <div style={{ position: 'relative', display: 'flex' }}>
                            <span className="title-paid-video">Premium</span>
                            <span className="icon-paid-video">
                              <img src="/icons-menu/crown_icon@3x.png" alt="icon-video"/>
                            </span>
                          </div>
                        </div>
                      ) : ''}
                    <Img alt={item.title}
                      src={[props.data.meta.image_path + RESOLUTION_IMG + item.portrait_image, getPathImage(...pathImg,item.portrait_image, false, 'potrait')]}
                      unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.portrait_image, false, 'potrait')}/>}
                      loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.portrait_image, false, 'potrait')}/>}/>
                    </div>
                    </a>
                  </Link>
                );
              }) }
            </div>
    </div>
  );
};
export const RatedModal = (props) => {
  const onAction = (status, filter, type) => {
    props.toggle();
    props.onLike(status, filter, type);
  };
  return (
    <div>
      <Modal isOpen={props.open} toggle={props.toggle} className="modal-custom rate-modal">
        <div className="rate-content-modal">
          <ButtonPrimary className="button-20" icon={ <ThumbUpIcon width="50" height="50" /> } onclick={() => onAction('LIKE', 'like', 'program')} />
          <ButtonPrimary className="button-20" icon={ <ThumbUpIcon width="50" height="50" rotate="180" /> } onclick={() => onAction('DISLIKE', 'like', 'program')} />
        </div>
        <div className="close-modal">
          <ButtonPrimary
            className="button-20"
            icon={ <CancelIcon /> }
            onclick={props.toggle}
             />
        </div>
      </Modal>
    </div>
  );
};
export const Trailer = (props) => {
  return (
    <div>
      <Modal isOpen={props.open} toggle={props.toggle} className="modal-custom trailer-modal">
        <div>{ props.player }</div>
        <div className="close-modal">
          <ButtonPrimary
            className="button-20"
            icon={ <CancelIcon /> }
            onclick={props.toggle}
             />
        </div>
      </Modal>
    </div>
  );
};
export const ActionMenu = (props) => {
  const indifferent = (status, filter, type) => {
    props.onLike(status, filter, type);
  };
  const rate = (data, content_type) => {
    let isLogin = false;
    if (data && data.status) { isLogin = data.status.code === 13 ? false : true; }
    if (data && data.data && data.data.length > 0) {
      const isLike = data.data[0].status === 'LIKE';
      const isDislike = data.data[0].status === 'DISLIKE';
      if (isLike) {
        return (<ButtonPrimary className="button-20" icon={ <ThumbUpIconSolid /> } text="Rated" onclick={() => {indifferent('INDIFFERENT', 'like', 'program');}}/>);
      } else if (isDislike) {

        return (<ButtonPrimary className="button-20" icon={ <ThumbUpIconSolid rotate="180" viewBox="-5 4 30 21" height="24" width="25" /> } text="Rated" onclick={() => {indifferent('INDIFFERENT', 'like', 'program');}}/>);
      } else {

        return (<ButtonPrimary className="button-20" icon={ <ThumbUpIcon /> } text="Rated" onclick={() => {
          // console.log('RATE1')
          onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'program_rate')
          return props.onRate()
          }}/>);
      }
    }
    return (
      <ButtonPrimary status={[isLogin, alertSignIn]}  className="button-20" icon={ <ThumbUpIcon /> } text="Rated" onclick={() => { 
        onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, 'program_rate')
        // console.log('RATE2')
        return props.onRate();
        }}/>
    );
  };
  return (
    <>
      { rate(props.like, 'program') }
      { bookmark(props.bookmark && props.bookmark.data, props.data, 'program', props, 'program_bookmark') }
    </>
  );
};
export const alertDownload = (data = null, type = null, Programid, programTitle, ref) => {
  // console.log(data, type, ref)
  if (data && type && ref) {
      switch (ref) {
          case 'homepage':
              programContentDownloadEvent(Programid, programTitle.data.title, data.title, type, data.id, 'mweb_homepage_program_content_download_clicked');
              break;

          case 'mylist':
              accountMylistDownloadClicked(Programid, programTitle.data.title, data.title, type, data.id, 'mweb_account_mylist_download_clicked');
              break;

          case 'library':
              libraryProgramContentDownloadClicked(Programid, programTitle.data.title, data.title, type, data.id, 'mweb_library_program_content_download_clicked');
              break;

          case 'search':
              searchProgramContentDownloadClicked(Programid, programTitle.data.title, data.title, type, data.id, 'mweb_search_program_content_download_clicked');
              break;
      }
  }
  showAlert('To be able to watch this episode offline, please download RCTI+ application on ' + (isIOS ? 'App Store' : 'Playstore'),
             '',
             'Open ' + (isIOS ? 'App Store' : 'Playstore'),
             'Cancel', () => { window.open((isIOS ? 'https://apps.apple.com/us/app/rcti/id1472168599' : 'https://play.google.com/store/apps/details?id=com.fta.rctitv'), '_blank'); });
};
export const alertSignIn = () => {
  showSignInAlert(`Please <b>Sign In</b><br/>
  Woops! Gonna sign in first!<br/>
  Only a click away and you<br/>
  can continue to enjoy<br/>
  <b>RCTI+</b>`, '', () => {}, true, 'Register', 'Login', true, true);
};
const showMore = () => { console.log('SHOW MORE'); };
const  getPathImage = (path,resolution,imgSrc, status, potrait) => {
  if (status) {
    return path + resolution + imgSrc;
  } else if (potrait === 'potrait') {
    return '/static/placeholders/placeholder_potrait.png';
  } else {
    return '/static/placeholders/placeholder_landscape.png';
  }
};

const bookmark = (data, item, type, props, typeTracking = null) => {
  if (data && data[type]) {
    const isBookmark = data && data[type].find((list) => list.id === item.id);
    if (isBookmark) {
      return (<ButtonPrimary
      icon={ <PlaylistAddCheckIcon/> }
      status={[props.isLogin, alertSignIn]}
      text={type === 'program' ? 'My List' : ''}
      className={ type === 'program' ? 'button-20' : '' }
      onclick={() => { 
        props.onBookmarkDelete(item.id, type);
        }}/>);
    }
    else {
      return (<ButtonPrimary
      icon={ <PlaylistAddIcon/> }
      status={[props.isLogin, alertSignIn]}
      text={type === 'program' ? 'My List' : ''}
      className={ type === 'program' ? 'button-20' : '' }
      onclick={() => { 
        onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, typeTracking, item, type)
        props.onBookmarkAdd(item.id, type);
        }}/>);
    }
  }
  return (<ButtonPrimary
  icon={ <PlaylistAddIcon/> }
  status={[props.isLogin, alertSignIn]}
  text={type === 'program' ? 'My List' : ''}
  className={ type === 'program' ? 'button-20' : '' }
  onclick={() => { 
    onTrackingClick(props.dataTracking.ref, props.dataTracking.idContent, props.dataTracking.title, typeTracking, item, type)
    props.onBookmarkAdd(item.id, type);
    }}/>);
};

let  swipe = {}

const onTouchStart = (e) => {
  let touch = e.touches[0];
  swipe = { x: touch.clientX };
}

const onTouchEnd = (e, ref, id, title) => {
  let touch = e.changedTouches[0];
  const absX = Math.abs(touch.clientX - swipe.x);
  // console.log(absX)
  if (absX > 50) {
          if (ref) {
              switch (ref) {
                  case 'homepage':
                      programRelatedEvent(id, title.data.title, 'mweb_homepage_program_related_scroll_horizontal');
                      break;

                  case 'library':
                      libraryGeneralEvent('mweb_library_program_related_scroll_horizontal');
                      break;

                  case 'search':
                      searchProgramRelatedScrollHorizontalEvent(id, title.data.title, 'mweb_search_program_related_scroll_horizontal');
                      break;
              }
          }
      }
}

export const onTracking = (ref, id , title) => {
  if (ref) {
    switch (ref) {
        case 'homepage':
            programShowMoreEvent(id, title.data.title, 'mweb_homepage_program_showmore_clicked');
            break;

        case 'library':
            libraryGeneralEvent('mweb_library_program_showmore_clicked');
            break;

        case 'search':
            searchProgramShowmoreClicked(id, title.data.title, 'mweb_search_program_showmore_clicked');
            break;
    }
  }
}

export const onTrackingClick = (ref, id, title, typeClick = 'program', item = null, content_type = null, selected_season = 1, data_player, event = 'mweb_error_event') => {
  // console.log(typeClick)
  if (ref && typeClick === 'program') {
    switch (ref) {
        case 'homepage':
            programTrailerEvent(title.data.title, id, 'program', 'mweb_homepage_program_trailer_clicked');
            break;

        case 'library':
            libraryProgramTrailerClicked('N/A', title.data.title, id, 'program', 'mweb_library_program_trailer_clicked');
            break;

        case 'search':
            searchProgramTrailerClicked('N/A', title.data.title, id, 'program', 'mweb_search_program_trailer_clicked');
            break;
    }
  }
  if (ref && typeClick === 'photo') {
    switch (ref) {
        case 'homepage':
            programContentEvent(id, title.data.title, 'photo', item.id, item.title, 'mweb_homepage_program_content_clicked');
            break;

        case 'mylist':
            accountMylistContentClicked(id, title.data.title, item.title, 'photo', item.id, 'mweb_account_mylist_content_clicked');
            break;
    }
  }
  if (ref && typeClick === 'program_bookmark') {
    switch (ref) {
      case 'homepage':
          programAddMyListEvent('bookmark', title.data.title, id, content_type, 'mweb_homepage_program_add_mylist_clicked');
          break;

      case 'library':
          libraryProgramAddMylistClicked('bookmark', title.data.title, id, content_type, 'mweb_library_program_add_mylist_clicked');
          break;

      case 'search':
          searchProgramAddMyListClicked('N/A', title.data.title, id, content_type, 'mweb_search_program_add_mylist_clicked');
          break;
    }
  }
  if (ref && typeClick === 'content_bookmark') {
    switch (ref) {
      case 'homepage':
        programContentAddMyListEvent(id, title.data.title, item.id, item.title, content_type, 'mweb_homepage_program_content_add_mylist_clicked');
        break;

      case 'library':
        libraryProgramContentAddMylistClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_library_program_content_add_mylist_clicked');
        break;

      case 'search':
        searchProgramContentAddMyListClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_search_program_content_add_mylist_clicked');
        break;
    }
  }
  if (ref && typeClick === 'program_rate') {
    switch (ref) {
      case 'homepage':
        programRateEvent('INDIFFERENT', title.data.title, id, 'program', 'mweb_homepage_program_rate_clicked');
        break;

      case 'library':
          libraryProgramRateClicked('INDIFFERENT', title.data.title, id, 'program', 'mweb_library_program_rate_clicked');
          break;

      case 'search':
          searchProgramRateClicked('INDIFFERENT', title.data.title, id, 'program', 'mweb_search_program_rate_clicked');
          break;
    }
  }
  if (ref && typeClick === 'program_share') {
    switch (ref) {
      case 'homepage':
        programShareEvent(title.data.title, id, 'program', 'mweb_homepage_program_share_clicked');
        break;

      case 'library':
        libraryProgramShareClicked(title.data.title, id, 'program', 'mweb_library_program_share_clicked');
        break;

      case 'search':
        searchProgramShareClicked('N/A', title.data.title, id, 'program', 'mweb_search_program_share_clicked');
        break;
    }
  }
  if (ref && typeClick === 'content_share') {
    switch (ref) {
      case 'homepage':
        programContentShareEvent(id, title.data.title, item.title, content_type, item.id, 'mweb_homepage_program_content_share_clicked');
        break;
    
      case 'mylist':
          accountMylistShareClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_account_mylist_share_clicked');
          break;

      case 'library':
          libraryProgramContentShareClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_library_program_content_share_clicked');
          break;

      case 'search':
          searchProgramContentShareClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_search_program_content_share_clicked');
          break;
    }
  }
  if (ref && typeClick === 'episode_season_close') {
    switch (ref) {
      case 'homepage':
        programSeasonCloseEvent(id, title.data.title, selected_season, 'mweb_homepage_program_season_close_clicked');
        break;

      case 'library':
          libraryProgramSeasonCloseClicked(id, title.data.title, selected_season, 'mweb_library_program_season_close_clicked');
          break;

      case 'search':
          searchProgramSeasonCloseClicked(id, title.data.title, selected_season, 'mweb_search_program_season_close_clicked');
          break;
    }
  }
  if (ref && typeClick === 'episode_season_click') {
    switch (ref) {
      case 'homepage':
        programSeasonListEvent(id, title.data.title, selected_season, 'mweb_homepage_program_season_list_clicked');
        break;

    case 'library':
        libraryProgramSeasonListClicked(id, title.data.title, selected_season, 'mweb_library_program_season_list_clicked');
        break;

    case 'search':
        searchProgramSeasonListClicked(id, title.data.title, selected_season, 'mweb_search_program_season_list_clicked');
        break;
    }
  }
  if (ref && typeClick === 'content_click_link') {
    switch (ref) {
      case 'homepage':
        programContentEvent(id, title.data.title, content_type, item.id, item.title, 'mweb_homepage_program_content_clicked');
        break;

    case 'mylist':
        accountMylistContentClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_account_mylist_content_clicked');
        break;

    case 'library':
        libraryProgramContentClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_library_program_content_clicked')
        break;

    case 'search':
        searchProgramContentClicked(id, title.data.title, item.title, content_type, item.id, 'mweb_search_program_content_clicked');
        break;
    }
  }
  if (ref && typeClick === 'tab_click') {
    switch (ref) {
      case 'homepage':
          programTabEvent(id, title.data.title, content_type, 'mweb_homepage_program_tab_clicked');
          break;

      case 'library':
          libraryProgramTabClicked(id, title.data.title, content_type, 'mweb_library_program_tab_clicked');
          break;

      case 'search':
          searchProgramTabClicked(id, title.data.title, content_type, 'mweb_search_program_tab_clicked');
          break;
    }
  }
  if (typeClick === 'content_click') {
    ProgramContentClick(data_player && data_player.program_id, data_player && data_player.program_title, data_player && data_player.content_name, data_player && data_player.content_type, data_player && data_player.id, data_player && data_player.duration, data_player && data_player.duration, event)
  }
}
