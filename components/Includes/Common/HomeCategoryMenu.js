import React, {useEffect, useRef, useState} from 'react'
import Link from "next/link"
import { withRouter } from 'next/router'

import { client } from "../../../graphql/client"
import { GET_HOME_CATEGORY_LIST, GET_SUB_CATEGORY_LIST } from "../../../graphql/queries/homepage"

import '../../../assets/scss/components/home-category-menu.scss';
import { urlRegex } from '../../../utils/regex'

function categoryMenu (props) {
  const imgSize = 150
  const [ categories, setCategories ] = useState([])
  const [ meta, setMeta ] = useState({})

  useEffect(() => {
    const query = props.router.query.category_id
      ? GET_SUB_CATEGORY_LIST(props.router.query.category_id)
      : GET_HOME_CATEGORY_LIST

    client
      .query({ query })
      .then(({ data }) => {
        const contents = props.router.query.category_id ? data.sub_categories : data.categories
        setCategories(contents.data)
        setMeta(contents.meta)
      })
      .catch(_ => {})

  }, [ props.router.query.category_id ])

  if (categories.length === 0) return null

  const checkLengthOfTheLabel = txt => {
    if (!txt) return "singleln"

    if (txt.length > 16) return "multiln"
    return "singleln"
  }

  return (
    <div 
      className="h-category-container">
      <div className="grid-h-category-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className="menu-item-cat" 
            id={`category-${index}`}>
            <Link 
              href={`/category?category_id=${category.id}&category_title=${category.name}`}
              as={`/category/${category.id}/${urlRegex(category.name)}`}
              >
              <a>
                <div className="container-menu-icon-cat">
                  <img
                    alt={category.name}
                    className="menu-icon-cat"
                    src={`${meta.image_path}${imgSize}${category.icon}`}
                    width="40"
                    height="auto"/>
                </div>
                <p className={`menu-label-cat ${checkLengthOfTheLabel(category.name)}`}>
                  {category.name}
                </p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default withRouter(categoryMenu)
