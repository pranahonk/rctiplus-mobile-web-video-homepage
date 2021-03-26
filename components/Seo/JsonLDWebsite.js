
import { BASE_URL, SHARE_BASE_URL } from '../../config'
const oneSegment = 'm.rctiplus.com';
export default function JsonLDWebsite ({keyword}) {
  const structurData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": oneSegment,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${oneSegment}/explores/keyword?q={${keyword}}`,
      "query-input": `required name=${keyword}`
    }
  }
  return(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structurData) }} />
    </>
  )
}