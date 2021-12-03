
import { gql } from '@apollo/client';

export const GET_HASTAGS = (page = 1, pageSize= 100, page_lineups = 1, pageSize_lineups =100) => {
 return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}){
        data {
          lineup_type_detail {
            ... on LineupTypeNewsTagar {
              detail(page: ${page_lineups}, page_size: ${pageSize_lineups}) {
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
  `;
};


export const GET_HASTAGS_PAGINATION = (lineup_id = 8, page = 2, page_size = 15) =>{
  return gql `
    query{
      lineup_news_tagars(lineup_id: ${lineup_id}, page: ${page}, page_size: ${page_size}){
        data{
          count
          created_at
          sorting
          tag
          type
          updated_at
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
        status{
          code
          message_client
          message_server
        }
      }
    }
  `;
};
