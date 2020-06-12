import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { TabPane } from 'reactstrap';


export const MainLoader = () => {
  return (
    <SkeletonTheme color="#1a1a1a" highlightColor="#282828">
      <div className="program-detail-main-wrapper">
        <div className="image--wrapper">
          <img className="background__program-detail" src="/static/placeholders/placeholder_landscape.png"/>
        </div>
        <div className="player__button--wrapper">
          <Skeleton height={30} width={60}/>
          <Skeleton height={30} width={60}/>
        </div>
        <div className="content--wrapper">
          <h1 className="content-title">
            <Skeleton height={10} width={70} />
          </h1>
          <div className="content-sub__title">
            <Skeleton height={10} width={20} />
            <Skeleton height={10} width={50} />
          </div>
          <div className="content-description">
            <br/>
            <Skeleton count={2} height={10} width={'30%'} />
            <Skeleton count={1} height={10} width={'20%'} />
            <Skeleton count={1} height={10} width={'50%'} />
            <Skeleton count={1} height={10} width={'30%'} />
            <Skeleton count={1} height={10} width={'10%'} />
            <Skeleton count={1} height={10} width={'100%'} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const TabListLoader = () => {
  const arr = [1,2,3,4];
  return (
    <SkeletonTheme color="#1a1a1a" highlightColor="#282828">
      <Nav tabs className="flex-nav">
        { arr.map((res,i) => {
          return (
            <NavItem key={i}>
              <NavLink style={{ padding: '10px' }}>
                <Skeleton count={1} height={10} width={'100%'} />
              </NavLink>
          </NavItem>
          );
        }) }
      </Nav>
    </SkeletonTheme>
  );
};
export const TabPanelLoader = () => {
  const arr = [1,2,3];
  return (
    <SkeletonTheme color="#1a1a1a" highlightColor="#282828">
      <TabPane tabId="Episodes">
          <div className="episode-program">
            { arr.map((item,i) => {
              return (
              <div style={{ padding: '10px 0' }} key={i}>
                <div className="panel-content">
                  <div className="thumb-img__content">
                      <Skeleton height={'100%'} width={'100%'}/>
                  </div>
                  <div className="thumb-detail__content" style={{ display: 'block' }}>
                    <Skeleton count={3} height={10} width={'100%'} />
                  </div>
                </div>
                <div className="summary__content">
                  <p>
                  <Skeleton count={2} height={10} width={'30%'} />
                  <Skeleton count={1} height={10} width={'20%'} />
                  <Skeleton count={1} height={10} width={'50%'} />
                  </p>
                </div>
              </div>
              );
            }) }
          </div>
        </TabPane>
    </SkeletonTheme>
  );
};

export const Puppy = () => {
  return (
    <div>
      <img
        alt="Puppy"
        src="https://cdn.glitch.com/a84f63e5-62cd-456b-89f4-c2adddc4e575%2Fpupper.jpeg?1552581003517"
      />
      <style jsx>{`
          img {
            border-radius: 50%;
            height: 100px;
            width: 100px;
            border: 2px solid white;
          }
        `}</style>
      </div>
  );
}
