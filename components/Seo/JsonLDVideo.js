
import { BASE_URL } from '../../config'
export default function JsonLDWebsite ({content, isProgram}) {
  const structurData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "contentURL": `${BASE_URL}${content?.asPath}`,
    "description": `${content?.title} livestream`,
    "duration": "PT37M14S",
    "embedUrl": `${BASE_URL}${content?.asPath}`,
    "expires": "2018-10-30T14:37:14+00:00",
    "interactionCount": "4756",
    "name": `Live ${content?.title} livestream!`,
    "thumbnailUrl": `${content?.thumbnailUrl}`,
    "uploadDate": "2018-10-27T14:00:00+00:00",
    "publication": [
      {
        "@type": "BroadcastEvent",
        "isLiveBroadcast": true,
        "startDate": "15:45",
        "endDate": "17:45"
      }
    ]
  }
  const structurDataProgram = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": content?.title,
        "description": content?.title,
        "thumbnailUrl": [
            content?.thumbnailUrl
        ],
        "uploadDate": "2016-03-31T08:00:00+08:00",
        "duration": "PT1M54S",
        "contentUrl": `${BASE_URL}${content?.asPath}`,
        "embedUrl": `${BASE_URL}${content?.asPath}`,
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "http://schema.org/WatchAction" },
            "userInteractionCount": "5647018"
        }
    }
  return(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(isProgram ? structurDataProgram : structurData) }} />
    </>
  )
}