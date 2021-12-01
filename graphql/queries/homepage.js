
import { gql } from "@apollo/client"

function getQueryParams(args) {
  let output = []
  for (const key in args) {
    if (args[key] > 0) output.push(`${key}: ${args[key]}`)
  }
  return output.join(", ")
}

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

export const GET_LINEUPS = (page = 1, page_size = 10, category_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, category_id })

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

export const GET_LINEUP_CONTENT_VIDEO = (page = 1, page_size = 10, lineup_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, lineup_id })

  return gql`
    query {
      lineup_contents(${queryParams}){
        data {
          content_id
          content_type
          content_type_detail {
            ... on ContentTypeProgram {
              detail {
                data {
                  id
                  portrait_image
                  landscape_image
                  square_image
                  medium_landscape_image
                  title
                  summary
                  permalink
                }
                status {
                  code
                }
              }
            }
            ... on ContentTypeEpisode {
              detail {
                data {
                  id
                  square_image
                  portrait_image
                  landscape_image
                  medium_landscape_image
                  title
                  summary
                  permalink
                }
                status {
                  code
                }
              }
            }
            ... on ContentTypeLiveEPG {
              detail {
                data {
                  id
                  countdown
                  title
                  is_live
                  start
                  landscape_image
                  start_ts
                }
                status {
                  code
                }
              }
            }
          }
        }
        meta {
          pagination {
            total_page
            current_page
          }
        }
      }
    }
  `
}
