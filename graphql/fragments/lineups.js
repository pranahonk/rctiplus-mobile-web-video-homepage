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
  contentTypeHotCompetitions,
  contentTypeHotVideo,
  contentTypeAudioPodcast,
  contentTypeAudioRadio,
}
  from './content_types';

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
  `;
};

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
        message_client
        message_server
      }
    }
  }
  `;
};

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
          ${contentTypeHotCompetitions}
          ${contentTypeHotVideo}
          ${contentTypeAudioPodcast}
          ${contentTypeAudioRadio}
        }
      }
     meta {
      pagination {
        current_page
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
  `;
};

export const lineupTypeNewsTagarFragment = (queryParams) => {
  return `
  ... on LineupTypeNewsTagar {
    detail(${queryParams}) {
      data {
        tag
        type
        sorting
        permalink
        deeplink
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

export const lineupTypeNewsRegroupingFragment = (queryParams) => {
  return `
  ... on LineupTypeNewsRegrouping {
    detail(${queryParams}) {
      data {
        cover
        id
        image
        pubDate
        subcategory_name
        source
        title
        permalink
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
    }
  }
  `;
};
