
import { gql } from "@apollo/client"

export const GET_BANNERS = gql`
  query {
    banners {
      data {
        id
        title
        square_image
      }
      meta {
        image_path
      }
    }
  }
`