import { useState } from "react"
import { DEV_API, BASE_URL, SITEMAP, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../../config';

import JsonLDVideo from '../../Seo/JsonLDVideo';

import Head from "next/head"


export default function HeadMetaTv({meta}){
  return(
    <Head>
      <JsonLDVideo content={meta.jsonLd} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" itemProp="image" content={meta.image} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:type" content="article" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="315" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
      <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
      <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
      <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:image:alt" content={meta.twitter_img_alt} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP} />
      <meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />

      <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    </Head>
  )
}