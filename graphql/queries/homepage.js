
import { gql } from "@apollo/client"

export const GET_BANNERS = gql`
  query {
    banners {
      data {
        landscape_image
        id
        sorting
      }
    }
  }
`

export const GET_LINEUPS = (page = 1, pageSize = 10) => {
  return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}) {
        data {
            id
            lineup_type
            content_type
            service
            title
            display_type
            sorting
        }
        meta {
          pagination {
            current_page
            total_page
          }
          image_path
        }
      }
    }
  `
}

export const GET_HOME_CATEGORY_LIST = gql`
  query {
    categories {
      data {
        icon 
        id
        is_active
        name
        type
      }
      meta {
        image_path
      }
    }
  }
`

export const GET_SUB_CATEGORY_LIST = (categoryId = 0) => {
  return gql`
    query {
      sub_categories(category_id: ${categoryId}) {
        data {
          icon
          id
          is_active
          name
          type
        }
        meta {
          image_path
        }
      }
    }
  `
}
