import React from 'react'
import {useSelector} from 'react-redux'
import { useRouter } from 'next/router'
import SearchIcon from '@material-ui/icons/Search';
import '../../assets/scss/components/search-results.scss';

const Popular = () => {
    const router = useRouter();
    const { search_popular } = useSelector(state => state.searches)

    const handleClick = (key) => router.replace(`/explores/search`, `/explores/keyword?q=${key}`, { shallow: true })

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", width:"100%"}}>
            {search_popular && search_popular?.length > 0 &&
                <div >
                    <p style={{fontSize:"14px",  fontWeight: "bold", marginBottom:"6px"}} className="title">Popular Search</p>

                    {search_popular && search_popular?.map((v,i) => (
                        <div style={{marginTop: "4px"}}>
                            <div onClick={() => handleClick(v.content_title)} style={{display: "flex", alignItems:"center", color: "#777777",  paddingTop:"4px"}}>
                                <SearchIcon style={{ fontSize: 20 }}/>
                                <div style={{marginLeft:"6px", fontSize:"14px", lineHeight:"22px", }}>{v.content_title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            } 
        </div>
    )
}

export default Popular
