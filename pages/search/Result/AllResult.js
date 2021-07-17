import React from 'react'
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { ButtonPrimary } from "../../../components/Includes/Common/Button";

import Img from 'react-image';
import ShareIcon from "../../../components/Includes/IconCustom/ShareIcon";
import GetApp from '@material-ui/icons/GetApp';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import '../../../assets/scss/components/search-results.scss';

const  AllResult = () => {
    const { search_all } = useSelector(state => state.searches)
    console.log(`ini adalah search all`, search_all )

    const  getPathImage = (path,resolution,imgSrc, status, potrait) => {
        if (status)  return path + resolution + imgSrc;
        else if (potrait === 'potrait') return '/static/placeholders/placeholder_potrait.png';
        else return '/static/placeholders/placeholder_landscape.png';  
    };

    return (
        <div style={{marginBottom: "30px"}} >
            {search_all !== null &&
                <div style={{background: "#282828"}} className="content-search">
                    {search_all?.program_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", fontWeight: "bold"}} className="header-list">
                                <p className="title">Program</p>
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <Row>
                                    {search_all !== null && 
                                        search_all?.program_data?.data.map((v, i) =>(
                                            <Col xs={4}>
                                                <Img 
                                                    alt={v.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[search_all?.program_data?.meta.image_path + "150" + v.portrait_image, '/static/placeholders/placeholder_potrait.png']} 
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
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.episode_data?.data.map((v, i) =>(
                                            <div style={{ padding: '10px 15px'}} key={i}>
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
                        </div>
                    }

                    {search_all?.catchup_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Catch Up</p>
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <Row>
                                    {search_all !== null && 
                                        search_all?.catchup_data?.data.map((v, i) =>(
                                            <Col xs={4}>
                                                <Img 
                                                    alt={v.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[search_all?.catchup_data?.meta.image_path + "150" + v.portrait_image, '/static/placeholders/placeholder_potrait.png']} 
                                                />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </div>
                        </div>
                    }

                    {search_all?.extra_data?.data?.length > 0 &&
                        <div>
                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"20px", fontWeight: "bold"}} className="header-list">
                                <p className="title">Extras</p>
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.extra_data?.data.map((v, i) =>(
                                            <div style={{ padding: '10px 15px'}} key={i}>
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
                                                        <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `${v.program_title} : ${v.title}` }</label>
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
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <div>
                                    {search_all !== null && 
                                        search_all?.clip_data?.data.map((v, i) =>(
                                            <div style={{ padding: '10px 15px'}} key={i}>
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
                                                        <label style={{fontSize:"12px", fontWeight:"bold"}} >{ `${v.program_title} : ${v.title}` }</label>
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
                                <div style={{color: "white"}} className="title"><ChevronRightRoundedIcon/></div>
                            </div>

                            <div className="content-list">
                                <Row>
                                    {search_all !== null && 
                                        search_all?.photo_data?.data.map((v, i) =>(
                                            <Col xs={4}>
                                                <Img 
                                                    alt={v.title} 
                                                    className="content-image"
                                                    unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                                    src={[search_all?.photo_data?.meta.image_path + "150" + v.portrait_image, '/static/placeholders/placeholder_potrait.png']} 
                                                />
                                            </Col>
                                        ))
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