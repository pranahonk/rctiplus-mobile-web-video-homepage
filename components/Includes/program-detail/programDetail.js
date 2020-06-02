import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Img from 'react-image';
import Router from 'next/router';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { TabPane } from 'reactstrap';
import { ButtonPrimary, ButtonOutline } from '../Common/Button';
import ShareIcon from '../IconCustom/ShareIcon';
import Dialog from '../../Modals/Dialog';
import PlayListAdd from '@material-ui/icons/PlayListAdd';
import PlayListAddCheck from '@material-ui/icons/PlayListAddCheck';
import GetApp from '@material-ui/icons/GetApp';
import { RESOLUTION_IMG } from '../../../config';
import { showAlert, showSignInAlert } from '../../../utils/helpers';
import { urlRegex } from '../../../utils/regex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid , faThumbsDown as faThumbsDownSolid} from '@fortawesome/free-solid-svg-icons';
import CancelIcon from '@material-ui/icons/Cancel';
import { Modal } from 'reactstrap';
const TabPanelLoader = dynamic(() => import('../Shimmer/detailProgramLoader').then((mod) => mod.TabPanelLoader));
import smoothscroll from 'smoothscroll-polyfill';

export const PanelEpisode = forwardRef((props, ref) => {
  smoothscroll.polyfill();
  const linkRef = useRef(null);
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };
  return (
      <TabPane tabId="Episodes">
        <div className="episode-program">
          <div className="season__program">
            <Dialog onclick={props.onSeason} selected={props.seasonSelected}/>
          </div>
          { props.data.data.map((item,i) => {
            return (
              <div style={{ padding: '10px 0' }} key={i}>
            <div className="panel-content">
              <div className="thumb-img__content">
                <Link href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=episode&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                      as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/episode/${item.id}/${urlRegex(item.title)}`}
                >
                  <a onClick={() => link(item.title, item.id, 'episode', item.summary)} ref={linkRef}>
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
                  { bookmark(props.bookmark && props.bookmark.data, item, 'episode', props) }
                  <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title)}/>
                  <ButtonPrimary icon={ <GetApp/> } onclick={alertDownload}/>
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
        { props.enableShowMore.isLoading ? (<TabPanelLoader />) : props.enableShowMore.isNext ? (
          <div style={{display: 'flex' ,justifyContent: 'center', width: '100%'}}>
            <ButtonOutline text="Show more" className="small-button" onclick={props.onShowMore}/>
          </div>
        ) : '' }
      </TabPane>
  );
});

export const PanelExtra = (props) => {
  const linkExtraRef = useRef();
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
  };
  return (
    <TabPane tabId="Extra">
      <div className="extra-program">
        { props.data.data.map((item,i) => {
          return (
            <div style={{ padding: '10px 0' }} key={i}>
          <div className="panel-content">
            <div className="thumb-img__content">
              <Link href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=extra&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                      as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/extra/${item.id}/${urlRegex(item.title)}`}
                >
                  <a onClick={() => link(item.title, item.id, 'extra', item.summary)} ref={linkExtraRef}>
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
                  { bookmark(props.bookmark && props.bookmark.data, item, 'extra', props) }
                  <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title)}/>
                  <ButtonPrimary icon={ <GetApp/> } onclick={alertDownload}/>
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
      {props.enableShowMore.isLoading ? (<TabPanelLoader />) : props.enableShowMore.isNext ? (
        <div style={{display: 'flex' ,justifyContent: 'center', width: '100%'}}>
          <ButtonOutline text="Show more" className="small-button" onclick={props.onShowMore}/>
        </div>
      ) : ''}
    </TabPane>
  );
};

export const PanelClip = (props) => {
  const linkClipRef = useRef();
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem) => {
    const href = `/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=${typeItem}&content_id=${idItem}&content_title=${urlRegex(titleItem)}`;
    const as = `/programs/${props.query.id}/${urlRegex(props.query.title)}/${typeItem}/${idItem}/${urlRegex(titleItem)}`;
    props.link(idItem,'data-player',1, typeItem);
    Router.push(href,as, { shallow: true });
  };
  return (
    <TabPane tabId="Clips">
      <div className="clip-program">
        { props.data.data.map((item,i) => {
          return (
            <div style={{ padding: '10px 0' }} key={i}>
          <div className="panel-content">
            <div className="thumb-img__content">
              <Link href={`/programs?id=${props.query.id}&title=${urlRegex(props.query.title)}&content_type=clip&content_id=${item.id}&content_title=${urlRegex(item.title)}`}
                        as={`/programs/${props.query.id}/${urlRegex(props.query.title)}/clip/${item.id}/${urlRegex(item.title)}`}
                  >
                    <a onClick={() => link(item.title, item.id, 'clip', item.summary)} ref={linkClipRef}>
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
                { bookmark(props.bookmark && props.bookmark.data, item, 'clip', props) }
                <ButtonPrimary icon={ <ShareIcon/> } onclick={props.onShare(item.title)}/>
                <ButtonPrimary icon={ <GetApp/> } onclick={alertDownload}/>
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
      {props.enableShowMore.isLoading ? (<TabPanelLoader />) : props.enableShowMore.isNext ? (
        <div style={{display: 'flex' ,justifyContent: 'center', width: '100%'}}>
          <ButtonOutline text="Show more" className="small-button" onclick={props.onShowMore}/>
        </div>
      ) : ''}
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
            <div key={i} className="thumb-img__content tab__photo-item">
              <Img alt={item.title}
              title={item.title}
              className="tab__photo-item_img" src={[props.data.meta.image_path + RESOLUTION_IMG + item.photos[0].image, getPathImage(...pathImg,item.portrait_image, false, 'potrait')]}
              unloader={<img className="tab__photo-item_img" src={getPathImage(...pathImg,item.photos[0].image, false, 'potrait')}/>}
              loader={<img className="tab__photo-item_img" src={getPathImage(...pathImg,item.photos[0].image, false, 'potrait')}/>}/>
            </div>
            );
          }) }
          </div>
        </div>
      </div>
      {props.enableShowMore.isLoading ? (<TabPanelLoader />) : props.enableShowMore.isNext ? (
        <div style={{display: 'flex' ,justifyContent: 'center', width: '100%'}}>
          <ButtonOutline text="Show more" className="small-button" onclick={props.onShowMore}/>
        </div>
      ) : ''}
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
            <div ref={containerRef} className="related__program-list">
              { props.data.data.map((item, i) => {
                return (
                  <Link key={i}
                        href={`/programs?id=${item.id}&title=${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                        as={`/programs/${item.id}/${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                  >
                    <a onClick={() => { link(item.id, item.title); }} ref={linkRef}>
                    <div className="related-item">
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
          <ButtonPrimary className="button-20" icon={ <FontAwesomeIcon icon={faThumbsUp} size="2x"/> } onclick={() => onAction('LIKE', 'like', 'program')} />
          <ButtonPrimary className="button-20" icon={ <FontAwesomeIcon icon={faThumbsDown} size="2x"/> } onclick={() => onAction('DISLIKE', 'like', 'program')} />
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
        return (<ButtonPrimary className="button-20" icon={ <FontAwesomeIcon icon={faThumbsUpSolid}/> } text="Rated" onclick={() => {indifferent('INDIFFERENT', 'like', 'program');}}/>);
      } else if (isDislike) {

        return (<ButtonPrimary className="button-20" icon={ <FontAwesomeIcon icon={faThumbsDownSolid}/> } text="Rated" onclick={() => {indifferent('INDIFFERENT', 'like', 'program');}}/>);
      } else {

        return (<ButtonPrimary className="button-20" icon={ <FontAwesomeIcon icon={faThumbsUp}/> } text="Rated" onclick={() => props.onRate()}/>);
      }
    }
    return (
      <ButtonPrimary status={[isLogin, alertSignIn]}  className="button-20" icon={ <FontAwesomeIcon icon={faThumbsUp}/> } text="Rated" onclick={() => props.onRate()}/>
    );
  };
  return (
    <>
      { rate(props.like, 'program') }
      { bookmark(props.bookmark && props.bookmark.data, props.data, 'program', props) }
    </>
  );
};
export const alertDownload = () => {
  showAlert('To be able to watch this episode offline, please download RCTI+ application on Playstore',
             '',
             'Open Playstore',
             'Cancel', () => { window.open('https://play.google.com/store/apps/details?id=com.fta.rctitv', '_blank'); });
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

const bookmark = (data, item, type, props) => {
  if (data && data[type]) {
    const isBookmark = data[type].find((list) => list.id === item.id);
    if (isBookmark) {
      return (<ButtonPrimary
      icon={ <PlayListAddCheck/> }
      status={[props.isLogin, alertSignIn]}
      text={type === 'program' ? 'My List' : ''}
      className={ type === 'program' ? 'button-20' : '' }
      onclick={() => { props.onBookmarkDelete(item.id, type); }}/>);
    }
    else {
      return (<ButtonPrimary
      icon={ <PlayListAdd/> }
      status={[props.isLogin, alertSignIn]}
      text={type === 'program' ? 'My List' : ''}
      className={ type === 'program' ? 'button-20' : '' }
      onclick={() => { props.onBookmarkAdd(item.id, type); }}/>);
    }
  }
  return (<ButtonPrimary
  icon={ <PlayListAdd/> }
  status={[props.isLogin, alertSignIn]}
  text={type === 'program' ? 'My List' : ''}
  className={ type === 'program' ? 'button-20' : '' }
  onclick={() => { props.onBookmarkAdd(item.id, type); }}/>);
};
