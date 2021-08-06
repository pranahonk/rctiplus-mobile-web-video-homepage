import React, { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import '../../assets/scss/components/search-results.scss';
import { getCookie, removeCookie } from '../../utils/cookie';

const History = () => {
    const { search_history } = useSelector(state => state.searches)
    const searchHistory = getCookie('SEARCH_HISTORY');

    console.log(`inimi`,search_history)

    const clearHistory = () =>{
        removeCookie('SEARCH_HISTORY');
    }

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", width:"100%"}}>
            { search_history.length > 0 &&
                <div className="header-list">
                    <div style={{display:"flex", justifyContent:"space-between"}}> 
                        <p style={{fontSize:"14px", lineHeight: "19px", fontWeight: "bold"}} className="title">History</p>
                        <p onClick={clearHistory} style={{ textAlign: 'right', paddingRight: 15, fontSize: 12, color: '#6e6e6e' }}>Clear all</p>
                    </div>
                    
                    {/* { JSON.parse(searchHistory).map((v,i) => (
                        <div style={{marginTop: "4px"}}>
                            <div style={{display: "flex", alignItems:"center", color: "#777777"}}>
                                <div style={{ fontSize:"14px", lineHeight:"22px", fontWeight:500 }}>{v}</div>
                            </div>
                        </div>
                    ))} */}

                    {search_history.map((v,i) => (
                        <div style={{marginTop: "4px"}}>
                            <div style={{display: "flex", alignItems:"center", color: "#777777"}}>
                                <div style={{ fontSize:"14px", lineHeight:"22px", }}>{v.content_title || v}</div>
                            </div>
                        </div>
                    ))}
                </div>
            } 
        </div>
    )
}

export default History
