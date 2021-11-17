
import { gql } from '@apollo/client';

export const GET_HASTAGS = (page = 1, pageSize= 15) => {
 return gql`
    query {
      lineups {
        data {
          lineup_type_detail {
            ... on LineupTypeNewsTagar {
              detail(page: ${page}, page_size: ${pageSize}) {
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
}
