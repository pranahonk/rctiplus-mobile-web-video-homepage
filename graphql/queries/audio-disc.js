import { gql } from '@apollo/client';

export const GET_AUDIO_SQUARE_PAGINATION = ( page_lineups = 1, pageSize_lineups = 100, lineupId = 1) => {
  return gql`
    query {
      lineup_contents(lineup_id: ${lineupId}, page: ${page_lineups}, page_size: ${pageSize_lineups}) {
        data {
          content_type_detail {
            ...on ContentTypeAudioRadio {
              detail{
                data {
                  audio_category
                  deeplink
                  episode
                  expired_at
                  expired_in
                  frequency
                  genre_level_1
                  genre_level_2
                  id
                  label
                  landscape_image
                  permalink
                  portrait_image
                  premium
                  product_id
                  program_id
                  season
                  square_image
                  summary
                  title
                  type
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
    }`
}
