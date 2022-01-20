import { gql } from '@apollo/client';

export const GET_HOT_COMPETITIONS_UPDATE = (page = 1, pageSize = 10, lineupId = 28) =>{
  return gql`
    query {
      lineup_contents(lineup_id: ${lineupId}, page: ${page}, page_size: ${pageSize}) {
        data {
          content_type_detail {
            ... on ContentTypeHOTCompetition {
              detail {
                data {
                  thumbnail
                  id
                  title
                  permalink
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
      }
    }
  `
}
