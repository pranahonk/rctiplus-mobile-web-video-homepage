import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function HorizontalMutipleLandscapeloader({withList}) {
  return (
    <div style={{ lineHeight: 1.3, paddingTop: withList ? 10 : 0 }}>
      <SkeletonTheme color="#393939" highlightColor="#282828">
        <div style={{ display: 'flex', padding: '0 0 8px 10px' }}>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
        </div>
        <div style={{ display: 'flex', padding: '0 0 8px 10px' }}>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
        </div>
        <div style={{ display: 'flex', padding: '0 0 8px 10px' }}>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
          <div>
            <Skeleton width={108} height={108}/>
          </div>
          <div style={{ padding: 10 }}>
            <Skeleton width={200} height={20} count={4}/>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
}
