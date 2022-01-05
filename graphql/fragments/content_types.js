
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