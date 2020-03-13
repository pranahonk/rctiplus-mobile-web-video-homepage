import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function ArticleLoader() {
    return (
        <div style={{ lineHeight: 1.3, paddingLeft: 10, paddingRight: 10 }}>
            <SkeletonTheme color="#393939" highlightColor="#282828">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                            display: 'inline-block',
                            width: '40%',
                            paddingRight: 10
                        }}>
                            <Skeleton height={95}/>
                        </div>
                        <div style={{ 
                            display: 'inline-block',
                            width: '60%',
                            paddingLeft: 10,
                            lineHeight: 1.6
                        }}>
                            <Skeleton width="100%"/>
                            <Skeleton width="80%"/>
                            <Skeleton width="90%"/>
                        </div>
                    </div>
                    <div style={{ paddingTop: 5 }}>
                        <Skeleton width="35%" height={6}/>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default ArticleLoader;