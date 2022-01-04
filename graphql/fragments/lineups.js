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
}
from "./content_types"

export const lineupTypeStoryFragment = (queryParams) => {
  return `
  ... on LineupTypeStory {
    detail(${queryParams}) {
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

export const lineupContinueWatchingFragment = (queryParams) => {
  return `
  ... on LineupTypeContinueWatching {
    detail(${queryParams}) {
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

export const lineupDefaultFragment = (queryParams) => {
  return `
  ... on LineupTypeDefault {
    detail(${queryParams}){
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

export const lineupTypeNewsTagarFragment = (queryParams) => {
  return `
  ... on LineupTypeNewsTagar {
    detail(${queryParams}) {
      data {
        permalink
      }
    }
  }
  `
}

export const lineupTypeNewsRegroupingFragment = (queryParams) => {
  return `
  ... on LineupTypeNewsRegrouping {
    detail(${queryParams}) {
      data {
        permalink
      }
    }
  }
  `
}
