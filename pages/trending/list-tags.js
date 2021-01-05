import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../components/Layouts/Default_v2';
import Head from 'next/head';
import queryString from 'query-string';
import '../../assets/scss/components/trending_v2.scss';
import Img from 'react-image';
import { getTruncate } from '../../utils/helpers';

// import component
// import ThumbnailNews from '../components/Includes/News/ThumbnailNews';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';


// Import Swiper styles
import 'swiper/swiper.scss';

const InteresTopic = (props) => {
  const [mockData, setMockData] = useState(constMockApi);
  const [endChild, setEndChild] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  const navbarRef = useRef(null);
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
  },[]);
  useEffect(() => {
    if (endChild) {
      if (mockData.meta.page < mockData.meta.totalPage) {
        setMockData((mockData) => ({data: [...mockData.data, ...constMockApi2.data], meta: constMockApi2.meta}));
      }
    }
  }, [endChild]);
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
        <div ref={navbarRef}>
          <NavBack
            src={`/news${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`}
            params={`${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`}
            titleNavbar={'#testtagar'}
            disableScrollListener />
        </div>
        <div className="list_tags_wrapper">
          <div className="list_tags_thumb">
            test
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InteresTopic;

const constMockApi = { data: [
  {name: 1},
  {name: 2},
  {name: 3},
  {name: 4},
  {name: 5},
  {name: 6},
  {name: 7},
  {name: 8},
  {name: 9},
  {name: 11},
  {name: 12},
  {name: 14},
  {name: 16},
 ],
 meta: {
   page: 1,
   totalPage: 2,
   totalData: 50,
 },
};
const constMockApi2 = { data: [
  {name: 17},
  {name: 18},
  {name: 19},
  {name: 21},
 ],
 meta: {
   page: 2,
   totalPage: 2,
   totalData: 50,
 },
};
