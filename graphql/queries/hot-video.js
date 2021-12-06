import { gql } from '@apollo/client';

export const GET_HOT_VIDEO = (page = 1, pageSize= 100, page_lineups = 1, pageSize_lineups =100) => {
  console.log(pageSize_lineups)
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
                    ... on ContentTypeHOTVideo {
                      detail(page: ${page_lineups}, page_size: ${pageSize_lineups}){
                        data{
                          thumbnail
                          id
                          views
                          contestant{
                            nick_name
                            thumbnail
                            display_name
                          }
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