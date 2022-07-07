import React, {useEffect, useRef, useState} from 'react'
import BottomScrollListener from 'react-bottom-scroll-listener'
import Link from "next/link"
import { withRouter } from 'next/router'

import { client } from "../../../graphql/client"
import { GET_HOME_CATEGORY_LIST, GET_SUB_CATEGORY_LIST } from "../../../graphql/queries/homepage"

import '../../../assets/scss/components/home-category-menu.scss';
import Cookies from 'js-cookie'
import { urlRegex } from '../../../utils/regex'
import { gaTrackerCategory } from '../../../utils/ga-360';

function categoryMenu (props) {
  const imgSize = 150
  const [ categories, setCategories ] = useState([])
  const [show, setShow] = useState(false);
  const [ meta, setMeta ] = useState({})

  useEffect(() => {
    getCategoryList(1)
  }, [ props.router.query.category_id ])

  useEffect(() => {
    if (categories.length > 0 && show) {
      if(meta?.pagination){
        if(meta?.pagination?.current_page < meta?.pagination?.total_page){
          getCategoryList(meta?.pagination?.current_page + 1);
        }
        else{
          setShow(false);
        }
      }else{
        getCategoryList(2);
      }
    }
  },[show]);


  const getCategoryList = (page) => {
    if(Cookies.get('VISITOR_TOKEN') || Cookies.get('ACCESS_TOKEN')) {
      const query = props.router.query.category_id
      ? GET_SUB_CATEGORY_LIST(props.router.query.category_id, page, 10)
      : GET_HOME_CATEGORY_LIST(page, 10)

      client
        .query({ query })
        .then(({ data }) => {
          const contents = props.router.query.category_id ? data.sub_categories : data.categories
          setCategories((list) => ([...list,  ...contents.data]))
          setMeta(contents.meta)
          setShow(false);
        })
        .catch(_ => {})
    }
  }

  if (categories.length === 0) return null

  const checkLengthOfTheLabel = txt => {
    if (!txt) return "singleln"

    if (txt.length > 16) return "multiln"
    return "singleln"
  }

  return (
    <div className="h-category-container">
      <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
        {scrollRef => (
          <div ref={scrollRef} className="grid-h-category-container">
            {categories.map((category, index) => (
              <div
                key={index}
                className="menu-item-cat"
                id={`category-${index}`}>
                <Link
                  href={`/category?category_id=${category.id}&category_title=${urlRegex(category.name)}`}
                  as={`/category/${category.id}/${urlRegex(category.name)}`}
                  shallow
                  >
                  <a>
                    <div className="container-menu-icon-cat" onClick={()=> gaTrackerCategory("video_interaction", "click_category_list", category.name, category.id)}>
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
        )}
      </ BottomScrollListener>
    </div>
  )
}

export default withRouter(categoryMenu)
