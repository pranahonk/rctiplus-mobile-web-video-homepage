
import { gql } from '@apollo/client';

export const GET_REGROUPING = (page = 1, pageSize= 15) => {
  return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}) {
        data {
          lineup_type_detail {
            ... on LineupTypeNewsRegrouping {
              detail {
                data {
                  author
                  category_source
                  content
                  count
                  country_id
                  country_name
                  cover
                  created_at
                  deeplink
                  description
                  exclusive
                  ga_partner_id
                  google_index
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
                  publisher_id
                  rss_id
                  share_link
                  sorting
                  source
                  subcategory_id
                  subcategory_name
                  tags
                  title
                  total_like
                  total_views
                  updated_at

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
          author
          category_source
          content
          count
          country_id
          country_name
          cover
          created_at
          deeplink
          description
          exclusive
          ga_partner_id
          google_index
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
          publisher_id
          rss_id
          share_link
          sorting
          source
          subcategory_id
          subcategory_name
          tags
          title
          total_like
          total_views
          updated_at
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
