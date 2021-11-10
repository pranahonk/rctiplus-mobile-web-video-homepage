
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
          lineup_type_detail {
            ... on LineupTypeDefault {
              detail {
                data {
                  content_id
                  content_type
                  content_type_detail {
                    ... on ContentTypeEpisode {
                      detail {
                        data {
                          portrait_image
                        }
                      }
                    }
                    ... on ContentTypeProgram {
                      detail {
                        data {
                          portrait_image
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on LineupTypeStory {
              detail {
                data {
                  program_id
                }
              }
            }
          }
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