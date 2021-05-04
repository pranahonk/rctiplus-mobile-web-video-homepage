import React, {useEffect, useState} from 'react';
// import Link from "next/link";
import {useSelector, useDispatch} from "react-redux";
import {getActiveCategory} from "../../../redux/actions/homeCategoryActions";
import TextLength from "../../../utils/textLength";
import '../../../assets/scss/components/home-category-menu.scss';

const CategoryMenu = ({contents}) => {
    const size = 150;
    const dispatch = useDispatch();
    const [listMenu, setListMenu] = useState([{}])
    const {listMenuHomeCategory} = useSelector(state => state.homeCategory);

    useEffect(() => {
        if(contents) setListMenu(contents)
        else dispatch(getActiveCategory());      
    }, []);

    useEffect(() => {
        if(contents) setListMenu(contents)
        else setListMenu(listMenuHomeCategory)
    }, [listMenuHomeCategory])

    return (
        <div className="h-category-container">
            <div style={listMenu?.data?.length <= 4 ? {display: "flex", justifyContent: "center", borderRadius: "20px"} : {width: "100%", maxWidth: "1200px"}} className="grid-h-category-container">
                
                {listMenu?.data && 
                listMenu.data.map((val, ind) => (
                    <div className="menu-item-cat">
                        {/* <Link href={`/category?category_id=${val.id}&category_title=${val.name}`}> */}
                            <div onClick={() => window.location.href=`/category?category_id=${val.id}&category_title=${val.name}`}>
                                <div style={{display: "flex",  flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <div className="container-menu-icon-cat">
                                        <img alt={val.name} className="menu-icon-cat" src={`${listMenu?.meta?.image_path}${size}${val.icon}`}/>
                                    </div>
                                    <p className="menu-label-cat">{TextLength(val.name, 10)}</p>
                                </div>
                            </div>
                        {/* </Link> */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryMenu
