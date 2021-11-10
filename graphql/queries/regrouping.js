
import { gql } from '@apollo/client';

export const GET_REGROUPING = gql`
 query {
  mock_news_regroupings {
    data {
      author
      category_source
      count
      country_id
      country_name
      cover
      created_at
      exclusive
      ga_partner_id
      id
      image
      is_headline
      link
      meta_description
      meta_keyword
      meta_title
      permalink
      pinned
      pubDate
      publish
      publish_date
      rss_id
      share_link
      title
      subcategory_name
      source
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
    }
  }
}


`;
