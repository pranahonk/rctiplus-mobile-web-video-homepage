import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import '../../../assets/scss/components/shimmer.scss';

function HomeLoader() {
  const data = [1,2,3,4];
  return (
    <div className="shimmer-container">
      <SkeletonTheme color="#393939" highlightColor="#282828">
        <div className="carousel-homepage-shimmer">
          <img src="/static/placeholders/placeholder_landscape.png"/>
          <Skeleton height={200}/>
        </div>
        <div className="homepage-menu-shimmer">
          <Skeleton height={50}/>
        </div>
        <div className="row homepage-story-shimmer">
          { data.map((value, i) => {
            return (
              <div className="col" key={i}>
                <Skeleton circle={ true } height={ 70 } width= { 70 } />
              </div>
              );
          }) }
        </div>
        <div className="row homepage-content-shimmer">
          { data.map((value, i) => {
            return (
              <div className="col" style={{ marginBottom: 20, padding: 0 , paddingRight: 10 }} key={i}>
                <Skeleton height={20} width={120} />
                <Skeleton height={100} />
              </div>
            )
          }) }
        </div>
      </SkeletonTheme>
    </div>
  );
}

export default HomeLoader;
