
import { gql } from "@apollo/client"

import {
  lineupContinueWatchingFragment,
  lineupTypeStoryFragment,
  lineupDefaultFragment,
  lineupTypeNewsTagarFragment,
  lineupTypeNewsRegroupingFragment
} from "../fragments/lineups"

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

export const GET_LINEUPS = (page = 1, page_size = 5, category_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, category_id })

  return gql`
    query {
      lineups(${queryParams}) {
        data {
            id
            content_type
            service
            title
            display_type
            sorting
            lineup_type
            lineup_type_detail {
              ${lineupContinueWatchingFragment(getQueryParams({ page: 1, page_size }))}
              ${lineupTypeStoryFragment(getQueryParams({ page: 1, page_size }))}
              ${lineupDefaultFragment(getQueryParams({ page: 1, page_size }))}
              ${lineupTypeNewsRegroupingFragment(getQueryParams({ page: 1, page_size }))}
              ${lineupTypeNewsTagarFragment(getQueryParams({ page: 1, page_size }))}
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
            type
            external_link
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

export const GET_HOME_STORIES = (category_id = 0, page = 1, page_size = 10) => {
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
            type
            external_link
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