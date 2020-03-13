import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function ListItemLoader() {
    return (
        <div style={{ lineHeight: 1.3, paddingLeft: 10, paddingRight: 10 }}>
            <SkeletonTheme color="#393939" highlightColor="#282828">
                <div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginTop: 10 
                    }}>
                        <div style={{ 
                            display: 'inline-block',
                            width: '60%',
                            paddingRight: 10,
                            paddingTop: 5,
                            lineHeight: 1.5
                        }}>
                            <Skeleton height={15} width="100%"/>
                            <Skeleton height={10} width="80%"/>
                        </div>
                        <div style={{ 
                            display: 'inline-block',
                            width: '40%',
                            paddingLeft: 10
                        }}>
                            <Skeleton height={35}/>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default ListItemLoader;