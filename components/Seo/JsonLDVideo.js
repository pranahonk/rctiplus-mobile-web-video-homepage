export default function JsonLDVideo (props) {
  const { content, isProgram } = props
  const rplusUrl = 'https://m.rctiplus.com';

  const channel = (title) => {
    switch (title) {
      case "rcti":
        return {
          name: "RCTI",
          interactionCount: "4927563",
          ratingCount: "841",
          sameAs: [
            "https://www.rcti.tv/",
            "https://www.google.com/search?q=RCTI&kponly&kgmid=/m/0824qb",
            "https://id.wikipedia.org/wiki/RCTI",
            "https://www.wikidata.org/wiki/Q5257835"
          ]
        }
      case "mnctv":
        return {
          name: "MNC TV",
          interactionCount: "1085711",
          ratingCount: "721",
          sameAs: [
            "https://mnctv.com/",
            "https://www.google.com/search?q=mnctv&kponly&kgmid=/m/0dvf5k",
            "https://id.wikipedia.org/wiki/MNCTV",
            "https://www.wikidata.org/wiki/Q6683165",
          ]
        }
      case "gtv":
        return {
          name: "Global TV (GTV)",
          interactionCount: "76242",
          ratingCount: "693",
          sameAs: [
            "https://www.gtv.id/",
            "https://www.google.com/search?q=global+tv&kponly&kgmid=/m/0b7bnq",
            "https://id.wikipedia.org/wiki/GTV_(Indonesia)",
            "https://www.wikidata.org/wiki/Q4201809",
          ]
        }
      case "inews":
        return {
          name: "iNews",
          interactionCount: "741225",
          ratingCount: "803",
          sameAs: [
            "https://www.inews.id/",
            "https://www.google.com/search?q=iNews&kponly&kgmid=/m/0gh85nz",
            "https://id.wikipedia.org/wiki/INews",
            "https://www.wikidata.org/wiki/Q4213609"
          ]
        }
    }
  }

  const liveStreamSEO = {
    // "@context": "https://schema.org",
    // "@type": "VideoObject",
    // "name": `Live Streaming ${channel(content?.title).name} Hari Ini`,
    // "contentURL": `${rplusUrl}${content?.asPath}`,
    // "description": `${channel(content?.title).name} Live Streaming`,
    // "duration": "P6Y4M6DT23H59M59S",
    // "interactionCount": channel(content?.title).interactionCount,
    // "thumbnailUrl": `${content?.thumbnailUrl}`,
    // "sameAs": channel(content?.title).sameAs,
    // "uploadDate": "2019-08-24T14:00:00+07:00",
    // "aggregateRating": {
    //   "@type": "AggregateRating",
    //   "ratingValue": "10",
    //   "bestRating": "10",
    //   "worstRating": "1",
    //   "ratingCount": channel(content?.title).ratingCount
    // },
    // "publication": [
    //   {
    //     "@type": "BroadcastEvent",
    //     "isLiveBroadcast": true,
    //     "startDate": "2008-03-05T14:00:00+00:00",
    //     "endDate": "2025-12-31T23:59:00+00:00",
    //     "sameAs": [
    //       "https://www.google.com/search?q=streaming+tv+internet&kponly&kgmid=/m/03x49v",
    //       "https://id.wikipedia.org/wiki/Televisi_Internet"
    //     ]
    //   }
    // ]
  }

  const programSEO = {
    // "@context": "https://schema.org",
    // "@type": "VideoObject",
    // "name": content?.title,
    // "description": content?.title,
    // "thumbnailUrl": [
    //     content?.thumbnailUrl
    // ],
    // "uploadDate": content?.startDate || '1 Januari 1979',
    // "contentUrl": `${rplusUrl}${content?.asPath}`,
  }
  return(
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(isProgram ? programSEO : liveStreamSEO) }} />
    </>
  )
}
