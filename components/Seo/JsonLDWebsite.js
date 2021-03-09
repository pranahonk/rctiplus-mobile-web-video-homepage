
import { BASE_URL } from '../../config'
export default function JsonLDWebsite ({keyword}) {
  const structurData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/explores/keyword?q={${keyword}}`,
      "query-input": `required name=${keyword}`
    }
  }
  return(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structurData) }} />
    </>
  )
}