
import { gql } from "@apollo/client"

export const GET_BANNERS = gql`
  query {
    banners {
      data {
        landscape_image
        id
        sorting
      }
    }
  }
`

export const GET_LINEUPS = (page = 1, pageSize = 10) => {
  return gql`
    query {
      lineups(page: ${page}, page_size: ${pageSize}) {
        data {
            id
            lineup_type
            content_type
            service
            title
            display_type
            sorting
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
  `
}

export const GET_LINEUP_STORIES = (page = 1, page_size = 7, lineup_id = 0) => {
  return gql`
    query {
      lineup_stories(lineup_id: ${lineup_id}, page: ${page}, page_size: ${page_size}) {
        data {
          program_img
          program_id
          title
          story {
            id
            permalink
            story_img
            link_video
            title
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
  `
}

export const GET_HOME_STORIES = (page = 1, page_size = 10, category_id = 0) => {
  return gql`
    query {
      stories {
        data {
          program_img
          program_id
          title
          story {
            id
            permalink
            story_img
            link_video
            title
          }
        }
        meta {
          image_path
          pagination {
            current_page
            total_page
          }
        }
      }
    }
  `
}