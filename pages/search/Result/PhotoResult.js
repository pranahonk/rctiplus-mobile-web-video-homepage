import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Img from 'react-image';
import NoResult from './NoResult';

const PhotoResult = () => {
    const { search_results } = useSelector(state => state.searches);
    return (
        <div style={{marginBottom: "30px"}} >
            <div style={{background: "#282828"}} className="content-search">
                <p style={{paddingBottom: "10px", fontWeight: "bold", fontSize:"14px" }} className="title">Result</p>
                {search_results[4]?.data?.data?.length > 0 ?
                    <div className="content-list">
                        <Row>
                            {search_results && 
                                search_results[4]?.data?.data?.map((v, i) =>(
                                    <Col onClick={() => onClick(v)} xs={6}>
                                        <Img 
                                            alt={v.title} 
                                            className="content-image"
                                            unloader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                            loader={<img className="content-image" src="/static/placeholders/placeholder_potrait.png"/>}
                                            src={[search_results[4]?.data?.meta.image_path + "150" + v.icon_image, '/static/placeholders/placeholder_potrait.png']} 
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                    </div> 

                    :

                    <NoResult />
                }
            </div>
        </div>
    )
}

export default PhotoResult
