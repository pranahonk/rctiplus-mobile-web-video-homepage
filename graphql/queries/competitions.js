import { gql } from '@apollo/client';

export const GET_HOT_COMPETITIONS = (page = 1, pageSize= 100, page_lineups = 1, pageSize_lineups =100) => {
  return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}) {
        data {
          lineup_type_detail {
            ... on LineupTypeDefault {
              detail {
                data {
                  content_id
                  content_type
                  content_type_detail {
                    ... on ContentTypeHOTCompetition {
                      detail(page: ${page_lineups}, page_size: ${pageSize_lineups}){
                        data{
                          thumbnail
                          id
                          title
                        }
                        meta{
                          assets_url
                          image_path
                          pagination{
                            current_page
                            per_page
                            total
                            total_page
                          }
                          video_path
                        }
                      }

                    }
                  }
                }
                meta {
                  assets_url
                  image_path
                  pagination {
                    current_page
                    per_page
                    total
                    total_page
                  }
                  video_path
                }
                status {
                  code
                  message_client
                  message_server
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

  `;
};
