import { gql } from '@apollo/client';

export const GET_HOT_VIDEO = (page = 1, pageSize= 100, page_lineups = 1, pageSize_lineups =100) => {
  return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}) {
        data {
          lineup_type_detail {
            ... on LineupTypeDefault {
              detail(page: ${page_lineups}, page_size: ${pageSize_lineups}) {
                data {
                  content_id
                  content_type
                  content_type_detail {
                    ... on ContentTypeHOTVideo {
                      detail{
                        data{
                          thumbnail
                          id
                          views
                          permalink
                          contestant{
                            nick_name
                            thumbnail
                            display_name
                            email
                            phone_code
                            phone_number
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


export const GET_HOT_VIDEO_PAGINATIONS = (page = 1, pageSize= 100, lineup_id= 88) => {
  return gql`
    query {
      lineup_contents(page: ${page}, page_size: ${pageSize}, lineup_id: ${lineup_id}){
        data{
          content_type_detail{
            ... on ContentTypeHOTVideo {
              detail{
                data{
                    thumbnail
                    id
                    views
                    deeplink
                    permalink
                    contestant{
                        nick_name
                        thumbnail
                        display_name
                        email
                        phone_code
                        phone_number
                    }
                }
              }

            }
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
  `
}
