import React from 'react'
import {useSelector} from 'react-redux'
import '../../assets/scss/components/search-results.scss';

const History = () => {
    const { search_history } = useSelector(state => state.searches)

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", width:"100%"}}>
            {search_history.length > 0 &&
                <div className="header-list">
                    <p style={{fontSize:"14px", lineHeight: "19px", fontWeight: "bold"}} className="title">History</p>

                    {search_history.map((v,i) => (
                        <div style={{marginTop: "4px"}}>
                            <div style={{display: "flex", alignItems:"center", color: "#777777"}}>
                                <div style={{ fontSize:"14px", lineHeight:"22px", }}>{v.content_title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            } 
        </div>
    )
}

export default History
