import { gql } from '@apollo/client';

export const GET_AUDIO_LIST_PAGINATION = ( page_lineups = 1, pageSize_lineups = 100, lineupId = 1) => {
    return gql`
      query {
        lineup_contents(lineup_id: ${lineupId}, page: ${page_lineups}, page_size: ${pageSize_lineups}) {
          data {
            content_type_detail {
              ... on ContentTypeAudioRadio {
                detail(page: 1, page_size: 6) {
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
                    __typename
                  }
                  meta {
                    assets_url
                    image_path
                    pagination {
                      current_page
                      per_page
                      total
                      total_page
                      __typename
                    }
                    video_path
                    __typename
                  }
                  status {
                    code
                    message_client
                    message_server
                    __typename
                  }
                  __typename
                }
                __typename
              }
              ... on ContentTypeAudioPodcast {
                detail(page: 1, page_size: 5) {
                  data {
                    author
                    deeplink
                    expired_at
                    expired_in
                    id
                    label
                    landscape_image
                    medium_landscape_image
                    permalink
                    portrait_image
                    premium
                    portrait_image
                    premium
                    product_id
                    square_image
                    summary
                    title
                    total_plays
                    type
                    __typename
                  }
                  meta {
                    assets_url
                    image_path
                    pagination {
                      current_page
                      per_page
                      total
                      total_page
                      __typename
                    }
                    video_path
                    __typename
                  }
                  status {
                    code
                    message_client
                    message_server
                    __typename
                  }
                  __typename
                }
                __typename
              }
              ... on ContentTypeAudioSpiritual {
                detail(page: 1, page_size: 6) {
                  data {
                    author
                    deeplink
                    expired_at
                    expired_in
                    id
                    label
                    landscape_image
                    medium_landscape_image
                    permalink
                    portrait_image
                    premium
                    portrait_image
                    premium
                    product_id
                    square_image
                    summary
                    title
                    total_plays
                    type
                    __typename
                  }
                  meta {
                    assets_url
                    image_path
                    pagination {
                      current_page
                      per_page
                      total
                      total_page
                      __typename
                    }
                    video_path
                    __typename
                  }
                  status {
                    code
                    message_client
                    message_server
                    __typename
                  }
                  __typename
                }
                __typename
              }
              ... on ContentTypeAudioPodcastContent{
                detail(page: 1, page_size: 5) {
                  data {
                    author
                    deeplink
                    expired_at
                    expired_in
                    id
                    label
                    landscape_image
                    medium_landscape_image
                    permalink
                    portrait_image
                    premium
                    portrait_image
                    premium
                    product_id
                    square_image
                    summary
                    title
                    total_plays
                    type
                    __typename
                  }
                  meta {
                    assets_url
                    image_path
                    pagination {
                      current_page
                      per_page
                      total
                      total_page
                      __typename
                    }
                    video_path
                    __typename
                  }
                  status {
                    code
                    message_client
                    message_server
                    __typename
                  }
                  __typename
                }
                __typename

              }
              ... on ContentTypeAudioSpiritualContent {
                detail(page: 1, page_size: 6) {
                  data {
                    author
                    deeplink
                    expired_at
                    expired_in
                    id
                    label
                    landscape_image
                    medium_landscape_image
                    permalink
                    portrait_image
                    premium
                    portrait_image
                    premium
                    product_id
                    square_image
                    summary
                    title
                    total_plays
                    type
                    __typename
                  }
                  meta {
                    assets_url
                    image_path
                    pagination {
                      current_page
                      per_page
                      total
                      total_page
                      __typename
                    }
                    video_path
                    __typename
                  }
                  status {
                    code
                    message_client
                    message_server
                    __typename
                  }
                  __typename
                }
                __typename
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
