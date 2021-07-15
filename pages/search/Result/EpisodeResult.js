import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Img from 'react-image';
import { ButtonPrimary } from "../../../components/Includes/Common/Button";
import ShareIcon from "../../../components/Includes/IconCustom/ShareIcon";
import GetApp from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const EpisodeResult = () => {
    const { search_results } = useSelector(state => state.searches);

    const  getPathImage = (path,resolution,imgSrc, status, potrait) => {
        if (status)  return path + resolution + imgSrc;
        else if (potrait === 'potrait') return '/static/placeholders/placeholder_potrait.png';
        else return '/static/placeholders/placeholder_landscape.png';  
    };
    
    return (
        <div style={{marginBottom: "30px"}} >
            <div style={{background: "#282828"}} className="content-search">
                {search_results[1]?.data?.data?.length > 0 && 
                    search_results[1]?.data?.data.map((v, i) =>(
                        <div style={{ padding: '10px 15px'}} key={i}>
                            <div style={{display:"flex"}} className="panel-content">
                                <div className="thumb-img__content">
                                    <Link href="" >
                                        <a >
                                            <Img alt={v.title}
                                                title={v.title}
                                                className="background__program-detail" src={[search_results[1]?.data?.meta.image_path + "150" + v.landscape_image, getPathImage(search_results[1]?.data?.meta.image_path,v.landscape_image, false)]}
                                                unloader={<img className="background__program-detail" src={getPathImage(search_results[1]?.data?.meta.image_path,v.landscape_image, false)}/>}
                                                loader={<img className="background__program-detail" src={getPathImage(search_results[1]?.data?.meta.image_path,v.landscape_image, false)}/>}/>
                                        </a>
                                    </Link> 
                                </div>
                                <div style={{marginLeft:"10px", width:"100%", display:"flex", justifyContent:"space-between", flexDirection:"column" }} className="thumb-detail__content">
                                    <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `E${('0'+v.episode).slice(-2)}:S${('0'+v.season).slice(-2)} ${v.title}` }</label>
                                    <div style={{display:"flex", justifyContent:"start"}} className="action-button__content ">
                                        <ButtonPrimary icon={ <PlaylistAddIcon/> } />
                                        <ButtonPrimary icon={ <ShareIcon/> } />
                                        <ButtonPrimary icon={ <GetApp/> } />
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
                }
            </div>
        </div>
    )
}

export default EpisodeResult
