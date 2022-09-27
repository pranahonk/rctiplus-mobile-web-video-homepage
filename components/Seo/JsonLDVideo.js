
// import { BASE_URL, SHARE_BASE_URL } from '../../config'
const oneSegment = 'https://m.rctiplus.com';
export default function JsonLDVideo ({content}) {
const structurData = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": `${content?.title} `,
  "thumbnailUrl": `${content?.thumbnailUrl}`,
  "uploadDate": content?.startDate || "2018-12-23T11:16:07+07:00",
  "contentURL": `${oneSegment}${content?.asPath}`,
  "description": `${content?.description}`,
  "duration": "PT00H30M5S",
  "embedUrl": `${oneSegment}${content?.asPath}`,
  "expires": content?.endDate || "3018-12-23T11:16:07+07:00",
  "publication":
    {
      "@type": "BroadcastEvent",
      "isLiveBroadcast": true,
      "startDate": content?.startDate || "2018-12-23T11:16:07+07:00",
      "endDate": content?.endDate || "3018-12-23T11:16:07+07:00",
    }

}

  return(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structurData) }} />
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

