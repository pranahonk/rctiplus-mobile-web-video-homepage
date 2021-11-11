
import { gql } from '@apollo/client';

export const GET_HASTAGS = gql`
 {
  mock_news_regroupings{
    data{
      author
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
    }
    status{
      code
      message_client
      message_server
    }
  }
}
`;
