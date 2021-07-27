import React from 'react'
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { ButtonPrimary } from "../../../components/Includes/Common/Button";
import { RESOLUTION_IMG } from '../../../config';
import { getTruncate } from '../../../utils/helpers';

import Img from 'react-image';
import ShareIcon from "../../../components/Includes/IconCustom/ShareIcon";
import { CirclePauseIcon, CircleTimeIcon, CirclePlayIcon } from "../../../components/IconComponents"
import GetApp from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import '../../../assets/scss/components/search-results.scss';

const  AllResult = ({handleTab, onClick}) => {
    const { search_all } = useSelector(state => state.searches)

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
            {search_all !== null &&
                <div style={{background: "#282828"}} className="content-search">
                    {search_all?.program_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", fontWeight: "bold"}} className="header-list">
                                <p className="title">Program</p>
                                <div onClick={() => handleTab("program")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <Row>
                                    {search_all !== null && 
                                        search_all?.program_data?.data.map((v, i) =>(
                                            <Col onClick={() => onClick(v, "program")} xs={4}>
                                                <Img 
                                                    alt={v.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[search_all?.program_data?.meta.image_path + RESOLUTION_IMG + v.portrait_image, '/static/placeholders/placeholder_potrait.png']} 
                                                />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </div>
                        </div>
                    }

                    {search_all?.episode_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Episode</p>
                                <div onClick={() => handleTab("episode")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.episode_data?.data.map((v, i) =>(
                                            <div onClick={() => onClick(v, "episode")} style={{ padding: '10px 15px'}} key={i}>
                                                <div style={{display:"flex"}} className="panel-content">
                                                    <div className="thumb-img__content">
                                                        <Link href="" >
                                                            <a >
                                                                <Img alt={v.title}
                                                                    title={v.title}
                                                                    className="background__program-detail" src={[search_all?.episode_data?.meta.image_path + "150" + v.landscape_image, getPathImage(search_all?.episode_data?.meta.image_path,v.landscape_image, false)]}
                                                                    unloader={<img className="background__program-detail" src={getPathImage(search_all?.episode_data?.meta.image_path,v.landscape_image, false)}/>}
                                                                    loader={<img className="background__program-detail" src={getPathImage(search_all?.episode_data?.meta.image_path,v.landscape_image, false)}/>}/>
                                                            </a>
                                                        </Link> 
                                                    </div>
                                                    <div style={{marginLeft:"10px", width:"100%", display:"flex", justifyContent:"space-between", flexDirection:"column" }} className="thumb-detail__content">
                                                        <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `E${('0'+v.episode).slice(-2)}:S${('0'+v.season).slice(-2)} :`} <span dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></span></label>
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
                        </div>
                    }

                    {search_all?.catchup_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Catch Up</p>
                                <div onClick={() => handleTab("catchup")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                {search_all !== null &&
                                    search_all?.catchup_data?.data.map((v, i) =>(
                                        <div style={{marginBottom: "1rem"}} className="content-list">
                                            <div style={{display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                                <div style={{display: "flex", alignItems:"center"}}>
                                                    <div><CirclePlayIcon /></div>
                                                    <div style={{marginLeft: "0.75rem"}}>
                                                        <div style={{fontSize: "12px", fontWeight:"bold"}} dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></div>
                                                        <div style={{fontSize: "10px"}}>{v.s} - {v.e}</div>
                                                    </div>
                                                </div>
                                                <div style={{marginRight:"0.50rem"}}>
                                                    <ShareIcon />
                                                </div> 
                                            </div>
                                        </div> 
                                    ))
                                }
                                {/* <Row>
                                    {search_all !== null && 
                                        search_all?.catchup_data?.data.map((v, i) =>(
                                            <Col onClick={() => onClick(v, "catchup")} xs={4}>
                                                <Img 
                                                    alt={v.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[search_all?.catchup_data?.meta.image_path + RESOLUTION_IMG + v.portrait_image, '/static/placeholders/placeholder_potrait.png']} 
                                                />
                                            </Col>
                                        ))
                                    }
                                </Row> */}
                            </div>
                        </div>
                    }

                    {search_all?.extra_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Extras</p>
                                <div onClick={() => handleTab("extras")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.extra_data?.data.map((v, i) =>(
                                            <div onClick={() => onClick(v, "extras")} style={{ padding: '10px 15px'}} key={i}>
                                                <div style={{display:"flex"}} className="panel-content">
                                                    <div className="thumb-img__content">
                                                        <Link href="" >
                                                            <a >
                                                                <Img alt={v.title}
                                                                    title={v.title}
                                                                    className="background__program-detail" src={[search_all?.extra_data?.meta.image_path + "150" + v.landscape_image, getPathImage(search_all?.extra_data?.meta.image_path,v.landscape_image, false)]}
                                                                    unloader={<img className="background__program-detail" src={getPathImage(search_all?.extra_data?.meta.image_path,v.landscape_image, false)}/>}
                                                                    loader={<img className="background__program-detail" src={getPathImage(search_all?.extra_data?.meta.image_path,v.landscape_image, false)}/>}
                                                                />
                                                            </a>
                                                        </Link> 
                                                    </div>
                                                    <div style={{marginLeft:"10px", width:"100%", display:"flex", justifyContent:"space-between", flexDirection:"column" }} className="thumb-detail__content">
                                                        <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `${v.program_title} :` } <span dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></span></label>
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
                        </div>
                    }

                    {search_all?.clip_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Clips</p>
                                <div onClick={() => handleTab("clips")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.clip_data?.data.map((v, i) =>(
                                            <div onClick={() => onClick(v, "clips")} style={{ padding: '10px 15px'}} key={i}>
                                                <div style={{display:"flex"}} className="panel-content">
                                                    <div className="thumb-img__content">
                                                        <Link href="" >
                                                            <a >
                                                                <Img alt={v.title}
                                                                    title={v.title}
                                                                    className="background__program-detail" src={[search_all?.clip_data?.meta.image_path + "150" + v.landscape_image, getPathImage(search_all?.clip_data?.meta.image_path,v.landscape_image, false)]}
                                                                    unloader={<img className="background__program-detail" src={getPathImage(search_all?.clip_data?.meta.image_path,v.landscape_image, false)}/>}
                                                                    loader={<img className="background__program-detail" src={getPathImage(search_all?.clip_data?.meta.image_path,v.landscape_image, false)}/>}
                                                                />
                                                            </a>
                                                        </Link> 
                                                    </div>
                                                    <div style={{marginLeft:"10px", width:"100%", display:"flex", justifyContent:"space-between", flexDirection:"column" }} className="thumb-detail__content">
                                                        <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `${v.program_title} :` } <span dangerouslySetInnerHTML={{ __html: setColoring(getTruncate(v.title, '...', 100)) }}></span></label>
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
                        </div>
                    }

                    {search_all?.photo_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Photos</p>
                                <div onClick={() => handleTab("photos")} style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <Row>
                                    {search_all !== null && 
                                        search_all?.photo_data?.data.map((v, i) =>{
                                            if(i <= 1)
                                            return (
                                                <Col onClick={() => onClick(v, "photo")} xs={6}>
                                                    <Img 
                                                        alt={v.title} 
                                                        className="content-image"
                                                        unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                        loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                        src={[search_all?.photo_data?.meta.image_path + RESOLUTION_IMG + v.icon_image, '/static/placeholders/placeholder_potrait.png']} 
                                                    />
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}


export default AllResult