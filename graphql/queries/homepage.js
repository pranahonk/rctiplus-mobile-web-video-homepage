
import { gql } from "@apollo/client"

function getQueryParams(args) {
  let output = []
  for (const key in args) {
    if (args[key] > 0) output.push(`${key}: ${args[key]}`)
  }
  return output.join(", ")
}

export const GET_BANNERS = (page = 1, category_id = 0) => {
  const queryParams = getQueryParams({ page, category_id })

  return gql`
    query {
      banners(${queryParams}) {
        data {
          permalink
          id
          title
          square_image
          portrait_image
          landscape_image
          type
          external_link
        }
        meta {
          image_path
        }
      }
    }
  `
}

export const GET_LINEUPS = (page = 1, page_size = 10) => {
  const queryParams = getQueryParams({ page, page_size })

  return gql`
    query {
      lineups(${queryParams}) {
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
