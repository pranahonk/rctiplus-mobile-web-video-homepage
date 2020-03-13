import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function HeadlineLoader() {
    return (
        <div style={{ lineHeight: 1.3 }}>
            <SkeletonTheme color="#393939" highlightColor="#282828">
                <Skeleton height={160}/>
                <div style={{ margin: 10 }}>
                    <Skeleton width="80%" height={12}/>
                    <Skeleton width="60%" height={12}/>
                    <Skeleton width="70%" height={12}/>
                    <Skeleton width="35%" height={7}/>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default HeadlineLoader;