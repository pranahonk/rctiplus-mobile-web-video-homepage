import React, { useState, useEffect } from 'react';
import {useSelector, connect} from 'react-redux';
import { useRouter } from 'next/router'
import '../../assets/scss/components/search-results.scss';
import { removeCookie, getCookie, setCookie } from '../../utils/cookie';
import searchActions from '../../redux/actions/searchActions';
import userActions from '../../redux/actions/userActions';
import ImgDelete from "../../static/btn/delete.svg"

const History = ({...props}) => {
    const router = useRouter();
    const { search_history } = useSelector(state => state.searches);
    const [searchHistory, setSearchHistory] = useState([])

    const clearHistory = () =>{
        removeCookie('SEARCH_HISTORY');
        props.clearAllHistory();
        window.location.reload()
    }

    const handleDeleteHistoryCookie = (index) =>{
        let history = searchHistory
        if (history && history.length > 0) {
            history.splice(index, 1);
            setCookie('SEARCH_HISTORY', history);
            window.location.reload()
        }
    }

    const handleDeleteHistory = (id) =>{
        props.deleteHistory(id)
    }

    const handleClick = (key) => router.replace(`/explores/search`, `/explores/keyword?q=${key}`, { shallow: true })

    useEffect(() => {
        let history = getCookie('SEARCH_HISTORY');
        if(history) setSearchHistory(JSON.parse(history));
    }, [])

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", width:"100%"}}>
            { search_history && search_history?.length > 0 ||  searchHistory &&  searchHistory?.length > 0 &&
                <div style={{width:"100%"}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}> 
                        <p style={{fontSize:"14px", lineHeight: "19px", fontWeight: "bold"}} className="title">History</p>
                        <p onClick={clearHistory} style={{ textAlign: 'right',  fontSize: 12, color: '#6e6e6e' }}>Clear all</p>
                    </div>
                    
                    { searchHistory && searchHistory?.map((v,i) => (
                        <div onClick={() => handleClick(v)} style={{paddingBottom: "4px"}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems:"center", color: "#777777"}}>
                                <div style={{ fontSize:"14px", lineHeight:"22px", fontWeight:500 }}>{v}</div>
                                <img onClick={() => handleDeleteHistoryCookie(i)} src={ImgDelete} alt="" />
                            </div>
                        </div>
                    ))}

                    { search_history && search_history?.map((v,i) => (
                        <div onClick={() => handleClick(v.content_title)} style={{paddingBottom: "4px"}} >
                            <div style={{display: "flex", justifyContent: "space-between", alignItems:"center", color: "#777777"}}>
                                <div style={{ fontSize:"14px", lineHeight:"22px", }}>{v.content_title || v}</div>
                                <img onClick={() => handleDeleteHistory(v.id)} src={ImgDelete} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
            } 
        </div>
    )
}

export default connect(state => state, {
    ...userActions,
    ...searchActions
})(History);
