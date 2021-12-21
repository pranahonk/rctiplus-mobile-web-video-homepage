
import { gql } from "@apollo/client"

function getQueryParams(args) {
  let output = []
  for (const key in args) {
    if (args[key] > 0) output.push(`${key}: ${args[key]}`)
  }
  return output.join(", ")
}

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

export const GET_LINEUPS = (page = 1, page_size = 10) => {
  const queryParams = getQueryParams({ page, page_size })

  return gql`
    query {
      lineups(${queryParams}) {
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
  const queryParams = getQueryParams({ page, page_size, lineup_id })

  return gql`
    query {
      lineup_stories(${queryParams}) {
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
  const queryParams = getQueryParams({ page, page_size, category_id })

  return gql`
    query {
      stories(${queryParams}) {
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