import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Img from 'react-image';
import Router from 'next/router';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { TabPane } from 'reactstrap';
import { ButtonPrimary, ButtonOutline } from '../Common/Button';
import { ShareIcon } from '../Icons/Actions';
import Dialog from '../../Modals/Dialog';
import PlayListAdd from '@material-ui/icons/PlayListAdd';
import GetApp from '@material-ui/icons/GetApp';
import { RESOLUTION_IMG } from '../../../config';
import Ripples from 'react-ripples';
const TabPanelLoader = dynamic(() => import('../Shimmer/detailProgramLoader').then((mod) => mod.TabPanelLoader));

export const PanelEpisode = (props) => {
  const linkRef = useRef(null);
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  const link = (titleItem, idItem, typeItem) => {
    const href = `/programs?id=${props.query.id}&title=${props.query.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}&content_type=${typeItem}&content_id=${idItem}&content_title=${titleItem.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`;
    const as = `/programs/${props.query.id}/${props.query.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}/${typeItem}/${idItem}/${titleItem.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`;
    // return [href, as]
    props.link(idItem,'data-player',1);
    Router.push(href,as, { shallow: true });
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
                <Link href={`/programs?id=${props.query.id}&title=${props.query.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}&content_type=episode&content_id=${item.id}&content_title=${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                      as={`/programs/${props.query.id}/${props.query.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}/episode/${item.id}/${item.title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()}`}
                >
                  <a onClick={() => { link(item.title, item.id, 'episode'); }} ref={linkRef}>
                    <Img alt={item.title}
                      className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
                      unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
                      loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
                  </a>
                </Link>
              </div>
              <div className="thumb-detail__content">
                <h3>{ item.title }</h3>
                <div className="action-button__content ">
                  <ButtonPrimary icon={ <PlayListAdd/> } onclick={() => { props.onBookmark(item.id, 'episode'); }}/>
                  <ButtonPrimary icon={ <ShareIcon/> }/>
                  <ButtonPrimary icon={ <GetApp/> }/>
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
            <ButtonOutline text="Show more" className="small-button" onclick={() => props.onShowMore}/>
          </div>
        ) : '' }
      </TabPane>
  );
};

export const PanelExtra = (props) => {
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  return (
    <TabPane tabId="Extra">
      <div className="extra-program">
        { props.data.data.map((item,i) => {
          return (
            <div style={{ padding: '10px 0' }} key={i}>
          <div className="panel-content">
            <div className="thumb-img__content">
              <Img alt={item.title}
              className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
              unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
              loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
            </div>
            <div className="thumb-detail__content">
              <h3>{ item.title }</h3>
              <div className="action-button__content ">
                <ButtonPrimary icon={ <PlayListAdd/> }/>
                <ButtonPrimary icon={ <ShareIcon/> }/>
                <ButtonPrimary icon={ <GetApp/> }/>
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
  const pathImg = [props.data.meta.image_path, RESOLUTION_IMG];
  return (
    <TabPane tabId="Clips">
      <div className="clip-program">
        { props.data.data.map((item,i) => {
          return (
            <div style={{ padding: '10px 0' }} key={i}>
          <div className="panel-content">
            <div className="thumb-img__content">
              <Img alt={item.title}
              className="background__program-detail" src={[props.data.meta.image_path + RESOLUTION_IMG + item.landscape_image, getPathImage(...pathImg,item.landscape_image, false)]}
              unloader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}
              loader={<img className="background__program-detail" src={getPathImage(...pathImg,item.landscape_image, false)}/>}/>
            </div>
            <div className="thumb-detail__content">
              <h3>{ item.title }</h3>
              <div className="action-button__content ">
                <ButtonPrimary icon={ <PlayListAdd/> }/>
                <ButtonPrimary icon={ <ShareIcon/> }/>
                <ButtonPrimary icon={ <GetApp/> }/>
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
