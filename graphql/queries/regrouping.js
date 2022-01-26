
import { gql } from '@apollo/client';

export const GET_REGROUPING = (page = 1, pageSize= 15, page_lineups = 1, pageSize_lineups =100) => {
  return gql`
    query {
      lineups(page: ${page_lineups}, page_size: ${pageSize_lineups}) {
        data {
          lineup_type_detail {
            ... on LineupTypeNewsRegrouping {
              detail (page: ${page}, page_size: ${pageSize}) {
                data {
                    cover
                    id
                    image
                    pubDate
                    subcategory_name
                    source
                    title
                    permalink
                }
                meta {
                  pagination {
                    current_page
                    per_page
                    total
                    total_page
                  }
                  image_path
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


export const GET_REGROUPING_LINEUPS = (page = 2, page_size = 15, lineup_id = 18) => {
  return gql `
    query {
      lineup_news_regroupings(page: ${page}, page_size: ${page_size}, lineup_id: ${lineup_id}) {
        data {
            cover
            id
            image
            pubDate
            subcategory_name
            source
            title
        }
        meta {
          pagination {
            current_page
            total_page
          }
          image_path
        }
        status {
          code
          message_client
          message_server
        }
      }
    }
  `;
};
