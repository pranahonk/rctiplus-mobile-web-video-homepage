import React, {useEffect, useState} from 'react'
import Link from "next/link"
import { withRouter } from 'next/router'

import { client } from "../../../graphql/client"
import { GET_HOME_CATEGORY_LIST, GET_SUB_CATEGORY_LIST } from "../../../graphql/queries/homepage"

import '../../../assets/scss/components/home-category-menu.scss';

function categoryMenu (props) {
    const imgSize = 150
    const [ categories, setCategories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ categoryId, setCategoryId ] = useState(props.router.query.category_id)

    useEffect(() => {        
        const query = categoryId 
            ? GET_SUB_CATEGORY_LIST(categoryId) 
            : GET_HOME_CATEGORY_LIST
        
        client
            .query({ query })
            .then(({ data }) => {
                const contents = categoryId ? data.sub_categories : data.categories
                setCategories(contents.data)
                setMeta(contents.meta)
            })
            .catch(_ => {})
    }, [ categoryId ])

    useEffect(() => {
        if (props.router.query.category_id !== categoryId) {
            setCategoryId(props.router.query.category_id)
        }
    })

    return (
        <div className="h-category-container">
            <div className="grid-h-category-container">
                {categories.map((category) => (
                    <div 
                        key={`${category.id}-home-category`} 
                        className="menu-item-cat">
                        <Link href={`/category?category_id=${category.id}&category_title=${category.name}`}>
                            <a style={{display: "flex",  flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: "54px", minWidth: "54px"}}>
                                <div className="container-menu-icon-cat">
                                    <img 
                                        alt={category.name} 
                                        className="menu-icon-cat" 
                                        src={`${meta.image_path}${imgSize}${category.icon}`}/>
                                </div>
                                <p className="menu-label-cat">{category.name}</p>
                            </a>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default withRouter(categoryMenu)
