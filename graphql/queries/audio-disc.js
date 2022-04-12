import { gql } from '@apollo/client';

export const GET_AUDIO_DISC = (page = 1, pageSize = 100, page_lineups = 1, pageSize_lineups = 100) => {
    return gql`
        query {
            mock_audios {
                data {
                    id
                    title
                    duration
                    image_url
                    image_name
                    image_banner
                    total_plays
                }
                meta {
                    assets_url
                    image_path
                    pagination {
                        current_page
                        per_page
                        total
                        total_page
                    }
                }
            }
        }`
}