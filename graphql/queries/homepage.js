
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
            ... on LineupTypeNewsRegrouping {
              detail {
                data {
                  author
                  category
                  category_id
                  content
                  count
                  deeplink
                  id
                  image
                  image_url
                  link
                  permalink
                  pubdate
                  source
                  title
                  total_like
                }
                meta {
                  pagination {
                    current_page
                    per_page
                    total
                    total_page
                  }
                }
                status {
                  code
                  message_client
                  message_server
                }
              }
            }
            ... on LineupTypeNewsTagar {
              detail {
                data {
                  tag
                  type
                  sorting
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
