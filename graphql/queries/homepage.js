import { gql } from '@apollo/client';

import {
  lineupContinueWatchingFragment,
  lineupDefaultFragment,
  lineupTypeNewsRegroupingFragment,
  lineupTypeNewsTagarFragment,
  lineupTypeStoryFragment,
} from '../fragments/lineups';

import {
  contentTypeAudioRadio,
  contentTypeCatchupFragment,
  contentTypeClipFragment,
  contentTypeEpisodeFragment,
  contentTypeExtraFragment,
  contentTypeLiveEPGFragment,
  contentTypeLiveEventFragment,
  contentTypeProgramFragment,
  contentTypeSeasonFragment,
  contentTypeSpecialFragment,
} from '../fragments/content_types';

function getQueryParams(args) {
  let output = []
  for (const key in args) {
    if (args[key] > 0) output.push(`${key}: ${args[key]}`)
  }
  return output.join(", ")
}

export const GET_BANNERS = (page = 1, category_id = 0) => {
  const queryParams = getQueryParams({ page, category_id })

  return gql`
    query {
      banners(${queryParams}) {
        data {
          permalink
          id
          title
          square_image
          portrait_image
          landscape_image
          type
          external_link
        }
        meta {
          image_path
        }
      }
    }
  `
}

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
            ${lineupDefaultFragment(getQueryParams({ page: 1, page_size: 6}))}
            ${lineupTypeNewsRegroupingFragment(getQueryParams({ page: 1, page_size: 30 }))}
            ${lineupTypeNewsTagarFragment(getQueryParams({ page: 1, page_size: 6 }))}
          }
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
        status{
          code
          message_client
          message_server
        }
      }
    }
  `
}

export const GET_LINEUP_STORIES = (page = 1, page_size = 5, lineup_id = 0) => {
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
          gpt {
            id
            div_gpt
            path
            size_height_1
            size_height_2
            size_width_1
            size_width_2
            cust_params{
              name
              value
            }
          }
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
        status {
          code
          message_client
          message_server
        }
      }
    }
  `
}

export const GET_LINEUP_CONTENT_VIDEO = (page = 1, page_size = 5, lineup_id = 0) => {
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
            ${contentTypeAudioRadio}
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

export const GET_CONTINUE_WATCHING = (page = 1, page_size = 5, lineup_id = 0) => {
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

export const GET_HOME_CATEGORY_LIST = (page = 1, page_size = 10) => {
  return gql`
    query {
      categories(page: ${page}, page_size: ${page_size}) {
        data {
          icon
          id
          is_active
          name
          type
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

export const GET_SUB_CATEGORY_LIST = (categoryId = 0, page = 1, page_size = 10) => {
  return gql`
    query {
      sub_categories(category_id: ${categoryId}, page: ${page}, page_size: ${page_size}) {
        data {
          icon
          id
          is_active
          name
          type
        }
        meta {
          image_path
        }
      }
    }
  `
}
