export const contentTypeProgramFragment = `
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
      premium
    }
    status {
      code
      message_client
      message_server
    }
    meta {
        image_path
        pagination {
          current_page
          total_page
        }
    }
  }
}`

export const contentTypeEpisodeFragment = `
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
      premium
    }
    status {
      code
      message_client
      message_server
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

export const contentTypeExtraFragment = `
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
      premium
    }
    status {
      code
      message_client
      message_server
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

export const contentTypeClipFragment = `
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
      premium
    }
    status {
      code
      message_client
      message_server
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

export const contentTypeCatchupFragment = `
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
      message_client
      message_server
    }
  }
}
`

export const contentTypeLiveEventFragment = `
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
      message_client
      message_server
    }
  }
}
`

export const contentTypeLiveEPGFragment = `
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
      message_client
      message_server
    }
  }
}
`

export const contentTypeSpecialFragment = `
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
      external_link
      action_type
      mandatory_login
    }
    status {
      code
      message_client
      message_server
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

export const contentTypeSeasonFragment = `
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
      message_client
      message_server
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

export const contentTypeHotCompetitions = `
     ... on ContentTypeHOTCompetition {
       detail(page: 1, page_size: 10){
         data{
           thumbnail
           id
           deeplink
           permalink
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
           video_path
         }
         status{
          code
          message_client
          message_server
          }
       }
     }
`

export const contentTypeHotVideo = `
  ... on ContentTypeHOTVideo {
    detail(page: 1, page_size: 1){
      data{
        thumbnail
        id
        views
        deeplink
        permalink
        contestant{
          nick_name
          thumbnail
          display_name
          email
          phone_code
          phone_number
        }
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
        video_path
      }
       status{
          code
          message_client
          message_server
      }
    }
  }
`


export const contentTypeAudioPodcast = `
  ... on ContentTypeAudioPodcast {
      detail(page: 1, page_size: 1){
        data{
            author
            categoryPodcasts_id
            create_date
            created_by
            deeplink
            description
            id
            image_banner
            image_name
            moderation_status
            modified_by
            permalink
            radios_id
            sort
            sort_all
            sso_id
            status
            title
            total_plays

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
          video_path
        }
         status{
            code
            message_client
            message_server
        }
      }
  }
`

export const contentTypeAudioRadio = `
  ... on ContentTypeAudioRadio {
      detail(page: 1, page_size: 1){
        data{
            audio_category
            deeplink
            episode
            expired_at
            expired_in
            frequency
            genre_level_1
            genre_level_2
            id
            label
            landscape_image
            permalink
            portrait_image
            premium
            product_id
            program_id
            season
            square_image
            summary
            title
            type
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
          video_path
        }
         status{
            code
            message_client
            message_server
        }
      }
  }
`
