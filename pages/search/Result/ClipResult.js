import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Img from 'react-image';
import { ButtonPrimary } from "../../../components/Includes/Common/Button";
import { getTruncate } from '../../../utils/helpers';
import ShareIcon from "../../../components/Includes/IconCustom/ShareIcon";
import GetApp from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import NoResult from './NoResult';

const ClipResult = ({onClick, onShare, onDownload}) => {
    const { search_results } = useSelector(state => state.searches);

    const  getPathImage = (path,resolution,imgSrc, status, potrait) => {
        if (status)  return path + resolution + imgSrc;
        else if (potrait === 'potrait') return '/static/placeholders/placeholder_potrait.png';
        else return '/static/placeholders/placeholder_landscape.png';  
    };

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
                {search_results[3]?.data?.data?.length > 0 ?
                    search_results[3]?.data?.data.map((v, i) =>(
                        <div onClick={() => onClick(v)} style={{ padding: '10px 15px'}} key={i}>
                            <div style={{display:"flex"}} className="panel-content">
                                <div className="thumb-img__content">
                                    <Link href="" >
                                        <a >
                                            <Img alt={v.title}
                                                title={v.title}
                                                className="background__program-detail" src={[search_results[3]?.data?.meta.image_path + "150" + v.landscape_image, getPathImage(search_results[3]?.data?.meta.image_path,v.landscape_image, false)]}
                                                unloader={<img className="background__program-detail" src={getPathImage(search_results[3]?.data?.meta.image_path,v.landscape_image, false)}/>}
                                                loader={<img className="background__program-detail" src={getPathImage(search_results[3]?.data?.meta.image_path,v.landscape_image, false)}/>}/>
                                        </a>
                                    </Link> 
                                </div>
                                <div style={{marginLeft:"10px", width:"100%", display:"flex", justifyContent:"space-between", flexDirection:"column" }} className="thumb-detail__content">
                                    <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `E${('0'+v.episode).slice(-2)}:S${('0'+v.season).slice(-2)} :`} <span dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></span></label>
                                    <div style={{display:"flex", justifyContent:"start"}} className="action-button__content ">
                                        <ButtonPrimary icon={ <PlaylistAddIcon/> } />
                                        <ButtonPrimary icon={ <ShareIcon/> } onclick={() => onShare(v.title, v.share_link)} />
                                        <ButtonPrimary icon={ <GetApp/> } onclick={onDownload} />
                                    </div>
                                 </div>
                            </div>
                            <div style={{marginTop: "5px", fontSize:"10px"}} className="summary__content">
                                <p>
                                    { v.summary }
                                </p>
                            </div>
                        </div>
                    ))

                    :

                    <NoResult />
                }
            </div>
        </div>
    )
}

export default ClipResult
