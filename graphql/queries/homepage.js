
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

export const GET_LINEUPS = (page = 1, page_size = 10, category_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, category_id })

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

export const GET_LINEUP_CONTENT_VIDEO = (page = 1, page_size = 10, lineup_id = 0) => {
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

export const GET_CONTINUE_WATCHING = (page = 1, page_size = 10, lineup_id = 0) => {
  const queryParams = getQueryParams({ page, page_size, lineup_id })

  return gql`
    query {
      lineup_continue_watching(${queryParams}) {
        data {
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

const contentTypeProgramFragment = `
... on ContentTypeProgram {
  detail {
    data {
      id
      portrait_image
      landscape_image
      square_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}`

const contentTypeEpisodeFragment = `
... on ContentTypeEpisode {
  detail {
    data {
      id
      square_image
      portrait_image
      landscape_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeExtraFragment = `
... on ContentTypeExtra {
  detail {
    data {
      id
      square_image
      portrait_image
      landscape_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeClipFragment = `
... on ContentTypeClip {
  detail {
    data {
      id
      square_image
      portrait_image
      landscape_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeCatchupFragment = `
... on ContentTypeCatchUp {
  detail {
    data {
      id
      countdown
      title
      is_live
      start
      landscape_image
      start_ts
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeLiveEventFragment = `
... on ContentTypeLiveEvent {
  detail {
    data {
      id
      countdown
      title
      live_at
      start_date
      landscape_image
      event_type
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeLiveEPGFragment = `
... on ContentTypeLiveEPG {
  detail {
    data {
      id
      countdown
      title
      is_live
      start
      landscape_image
      start_ts
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeSpecialFragment = `
... on ContentTypeSpecial {
  detail {
    data {
      id
      square_image
      portrait_image
      landscape_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}
`

const contentTypeSeasonFragment = `
... on ContentTypeSeason {
  detail {
    data {
      id
      square_image
      portrait_image
      landscape_image
      medium_landscape_image
      title
      summary
      permalink
    }
    status {
      code
    }
  }
}
`
