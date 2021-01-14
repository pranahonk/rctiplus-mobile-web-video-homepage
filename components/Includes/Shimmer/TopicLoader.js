import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function TopicLoader({withList}) {
  return (
    <div style={{ lineHeight: 1.3, paddingTop: withList ? 10 : 0 }}>
        <SkeletonTheme color="#393939" highlightColor="#282828">
            <div style={{ margin: 10 }}>
                {withList ? (<Skeleton width="60%" height={20}/>) : ''}
                <div>
                  <Skeleton width="70%" height={150}/>
                  <Skeleton width="30%" height={150}/>
                </div>
            </div>
        </SkeletonTheme>
    </div>
  );
}
