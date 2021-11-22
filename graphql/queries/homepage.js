
import { gql } from "@apollo/client"

export const GET_BANNERS = gql`
  query {
    banners {
      data {
        id
        title
        square_image
      }
      meta {
        image_path
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
