import { gql } from "@apollo/client"

import {
  lineupContinueWatchingFragment,
  lineupTypeStoryFragment,
  lineupDefaultFragment,
  lineupTypeNewsTagarFragment,
  lineupTypeNewsRegroupingFragment
} from "../fragments/lineups"

import {
  contentTypeCatchupFragment,
  contentTypeClipFragment,
  contentTypeEpisodeFragment,
  contentTypeExtraFragment,
  contentTypeLiveEPGFragment,
  contentTypeLiveEventFragment,
  contentTypeProgramFragment,
  contentTypeSeasonFragment,
  contentTypeSpecialFragment,
} from "../fragments/content_types"

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
              ${lineupContinueWatchingFragment(getQueryParams({ page: 1, page_size, category_id }))}
              ${lineupTypeStoryFragment(getQueryParams({ page: 1, page_size, category_id }))}
              ${lineupDefaultFragment(getQueryParams({ page: 1, page_size, category_id }))}
              ${lineupTypeNewsRegroupingFragment(getQueryParams({ page: 1, page_size, category_id }))}
              ${lineupTypeNewsTagarFragment(getQueryParams({ page: 1, page_size, category_id }))}
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

export const GET_LINEUP_CONTENT_VIDEO = (page = 1, page_size = 7, lineup_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, lineup_id })

  return gql`
    query {
      lineup_contents(${queryParams}){
        data {
          content_id
          content_type
          content_type_detail {
            ${contentTypeProgramFragment}
            ${contentTypeEpisodeFragment}
            ${contentTypeExtraFragment}
            ${contentTypeClipFragment}
            ${contentTypeCatchupFragment}
            ${contentTypeLiveEventFragment}
            ${contentTypeLiveEPGFragment}
            ${contentTypeSpecialFragment}
            ${contentTypeSeasonFragment}
          }
        }
        meta {
          pagination {
            total_page
            current_page
          }
        }
      }
    }
  `
}

export const GET_CONTINUE_WATCHING = (page = 1, page_size = 7, lineup_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, lineup_id })

  return gql`
    query {
      lineup_continue_watching(${queryParams}) {
        data {
          id
          landscape_image
          portrait_image
          square_image
          medium_landscape_image
          permalink
          duration
          last_duration
        }
        meta {
          image_path
          pagination {
            current_page
            total_page
          }
        }
        status {
          code
        }
      }
    }
  `
}