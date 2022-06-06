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
          image_banner
          image_name

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
            address
            audio_category
            audio_content_type
            audio_url
            categoryradios_id
            city
            content_duration
            created_by
            created_date
            current_song_file_name
            date_time
            drive_google_url
            duration_spent
            email
            episode
            facebook
            frequency
            genre_level_1
            genre_level_2
            id
            image_banner
            image_name
            image_banner_radio_partner
            image_name
            is_deleted
            latitude
            longitude
            name
            phone
            pilar
            program_id
            progress
            published_date
            radio_country
            radio_region
            rss
            season
            share_type
            slug
            sort_banner
            sort_music
            sort_network
            sso_id
            status
            statusradios
            tab_name
            twitter
            updated_by
            updated_date
            website
            whatsapp
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
