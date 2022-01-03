import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function HastagLoader({withList}) {
  return (
    <div style={{ lineHeight: 1.3, paddingTop: withList ? 10 : 0 }}>
      <SkeletonTheme color="#393939" highlightColor="#282828">
        <div style={{ display: 'flex' }}>
          <div>
            <Skeleton width={147} height={40}/>
          </div>
          <div style={{ padding: '0 0 0 10px'}}>
            <Skeleton width={147} height={40}/>
          </div>
          <div style={{ padding: '0 0 0 10px'}}>
            <Skeleton width={147} height={40}/>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
}
