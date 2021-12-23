
// import { BASE_URL, SHARE_BASE_URL } from '../../config'
const oneSegment = 'm.rctiplus.com';
export default function JsonLDVideo ({content, isProgram}) {
    // console.log('Meta seo: ',content)
    export default function JsonLDVideo ({content, isProgram}) {
      // console.log('Meta seo: ',content)
    const structurData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "contentURL": `${oneSegment}${content?.asPath}`,
      "description": `${content?.description}`,
      // "duration": "PT37M14S",
      "embedUrl": `${oneSegment}${content?.asPath}`,
      "expires": `${content?.expires || '1 Januari 9999'}`,
      "interactionCount": "4756",
      "name": `Live ${channel(content?.title)} livestream!`,
      "thumbnailUrl": `${content?.thumbnailUrl}`,
      "uploadDate": content?.startDate || "2018-10-27T14:00:00+00:00",
      "publication": [
        {
          "@type": "BroadcastEvent",
          "isLiveBroadcast": true,
          "startDate": content?.startDate || '1 Januari 1979',
          "endDate": content?.endDate || '1 Januari 9999'
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
        "uploadDate": content?.startDate || '1 Januari 1979',
        // "duration": "PT1M54S",
        "contentUrl": `${oneSegment}${content?.asPath}`,
        // "embedUrl": `${oneSegment}${content?.asPath}`,
    }
  return(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(isProgram ? structurDataProgram : structurData) }} />
    </>
  )
}

const channel = (title) => {
  if(title === 'rcti') {
    return 'RCTI'
  }
  if(title === 'mnctv') {
    return 'MNCTV'
  }
  if(title === 'gtv') {
    return 'GTV'
  }
  if(title === 'inews') {
    return 'iNews TV'
  }
  return title
}
