
import { gql } from '@apollo/client';

export const GET_REGROUPING = (page = 1, pageSize= 15) => {
  return gql`
    query {
      lineups {
        data {
          lineup_type_detail {
            ... on LineupTypeNewsRegrouping {
              detail(page: ${page}, page_size: ${pageSize}) {
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
