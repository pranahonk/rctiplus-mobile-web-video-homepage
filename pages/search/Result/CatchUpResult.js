import React from 'react';
import { useSelector } from 'react-redux';
import { getTruncate } from '../../../utils/helpers';
import ShareIcon from "../../../components/Includes/IconCustom/ShareIcon";
import { CirclePauseIcon, CircleTimeIcon, CirclePlayIcon } from "../../../components/IconComponents"
import NoResult from './NoResult';

const CatchupResult = ({onClick}) => {
    const { search_results } = useSelector(state => state.searches);

    const setColoring = (text, tags) =>{
        const params = new URLSearchParams(window.location.search) // id=123
        const keyword = params.get('q'); // 123
        const replace = new RegExp(keyword,"ig");
        if(keyword) {
          if (text.toLowerCase().includes(keyword.toLowerCase())) {
            return text.replace(replace, match => `<span style='color: #04a9e5'>${match}</span>`);
          } else {
            return `#<span style='color: #04a9e5'>${keyword.replace("#", "")}</span> - ${text} `;
          }
        }
        else{
          return text;
        }
    }

    return (
        <div style={{marginBottom: "30px"}} >
            <div style={{background: "#282828"}} className="content-search">
                <p style={{paddingBottom: "10px", fontWeight: "bold", fontSize:"14px" }} className="title">Result</p>
                {search_results[5]?.data?.data?.length > 0 ?
                    search_results[5]?.data?.data.map((v,i) => {
                        return(
                            <div onClick={() => onClick(v)} style={{marginBottom: "1rem"}} className="content-list">
                                <div style={{display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <div style={{display: "flex", alignItems:"center"}}>
                                        <div><CirclePlayIcon /></div>
                                        <div style={{marginLeft: "0.75rem"}}>
                                            <div style={{fontSize: "12px", fontWeight:"bold"}} dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></div>
                                            <div style={{fontSize: "10px"}}>{v.s} - {v.e}</div>
                                        </div>
                                    </div>
                                    <div style={{marginRight:"1rem"}}>
                                        <ShareIcon />
                                    </div>  
                                </div>
                            </div> 
                        )
                    })

                    :

                    <NoResult />
                }
            </div>
        </div>
    )
}

export default CatchupResult
