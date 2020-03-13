import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function TabLoader() {
    return (
        <SkeletonTheme color="#393939" highlightColor="#282828">
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ width: '18%' }}>
                    <Skeleton/>
                </div>
                <div style={{ width: '18%' }}>
                    <Skeleton/>
                </div>
                <div style={{ width: '18%' }}>
                    <Skeleton/>
                </div>
                <div style={{ width: '23%' }}>
                    <Skeleton/>
                </div>
            </div>
        </SkeletonTheme>
    );
}

export default TabLoader;