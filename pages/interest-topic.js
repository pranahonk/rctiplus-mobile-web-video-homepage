import React, { useEffect, useState } from 'react';
import Layout from '../components/Layouts/Default_v2';
import Head from 'next/head';
import queryString from 'query-string';

// import component
import ThumbnailNews from '../components/Includes/News/ThumbnailNews'
import NavBack from '../components/Includes/Navbar/NavTrendingDetail';

const InteresTopic = (props) => {
  const [accessToken, setAccessToken] = useState(null)
  const [platform, setPlatform] = useState(null)
  useEffect(() => {
    const query = queryString.parse(location.search)
    if (query.accessToken) {
      setAccessToken(query.accessToken)
      setPlatform(query.platform)
    }
  },[])
  return (
    <>
      <Layout title="RCTI+ - News + Tagar">
        <Head>
          {/* <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          <meta property="og:title" content={metadata.title} />
          <meta property="og:image" itemProp="image" content={metadata.image} />
          <meta property="og:url" content={encodeURI(this.props.router.asPath)} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
          <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
          <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
          <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
          <meta name="twitter:image" content={metadata.image} />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:url" content={encodeURI(this.props.router.asPath)} />
          <meta name="twitter:domain" content={encodeURI(this.props.router.asPath)} />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9" />
          <script dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-145455301-9');
          ` }} /> */}
        </Head>
        <NavBack
          src={`/news${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`}
          params={`${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`}
          titleNavbar={'#ANUNGGANTENG'}
          disableScrollListener />
        <div className="news-interest_wrapper">
          <ThumbnailNews />
        </div>
      </Layout>
    </>
  );
};

export default InteresTopic;
