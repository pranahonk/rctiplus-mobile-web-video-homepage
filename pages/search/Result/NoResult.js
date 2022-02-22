import React from 'react'
import ImgNoResult from "../../../static/btn/no_search.svg"

export default function NoResult() {
    const params = new URLSearchParams(window.location.search) // id=123
    const keyword = params.get('q'); // 123

    return (
        <div style={{marginBottom: "30px", width: "100%", fontStyle:"normal"}} >
            <div style={{fontSize:"12px"}} >Your search for “<span style={{fontWeight:"bold"}}>{keyword}</span>” did not match any contents.</div>

            <div style={{marginTop: "30px", width: "100%", display:"flex", justifyContent:"center"}}>
                <img src={ImgNoResult} alt="no result" />
            </div>

            <p style={{marginTop: "30px", paddingBottom: "10px", fontWeight: "bold", fontSize:"14px" }} className="title">A few suggestions</p>

            <ul style={{fontSize:"12px", fontWeight:300}}>
                <li>Make sure your words are spelled correctly</li>
                <li>Try different keywords</li>
                <li>Try more general keywords</li>
            </ul>
        </div>
    )
}
