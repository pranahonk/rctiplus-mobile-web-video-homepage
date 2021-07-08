import React from 'react'
import {useSelector} from 'react-redux'
import SearchIcon from '@material-ui/icons/Search';
import '../../assets/scss/components/search-results.scss';

const Sugestion = () => {
    const { search_suggestion } = useSelector(state => state.searches)
    console.log(`ini suggestion`, search_suggestion)

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", width:"100%", paddingBottom:"25px"}}> 
            <div className="header-list">   
                {search_suggestion.length > 0 && search_suggestion.map((v,i) => (
                    <div style={{marginTop: "4px"}}>
                        <div style={{display: "flex", alignItems:"center", color: "#777777", paddingTop:"4px"}}>
                            <SearchIcon style={{ fontSize: 20 }}/>
                            <div style={{marginLeft:"6px", fontSize:"14px", lineHeight:"22px", }}>{v.title}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sugestion
