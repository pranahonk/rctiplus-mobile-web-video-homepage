
import { gql } from '@apollo/client';

export const GET_HASTAGS = gql`
 query {
  mock_news_tagars {
    data {
      count
      created_at
      sorting
      tag
      type
    }
    meta {
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
    status {
      code
      message_client
      message_server
    }
  }
}
`;
