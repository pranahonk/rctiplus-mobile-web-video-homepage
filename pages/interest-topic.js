import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Layout from '../components/Layouts/Default_v2';
import Head from 'next/head';
import queryString from 'query-string';
import '../assets/scss/components/trending_v2.scss';

// import component
// import ThumbnailNews from '../components/Includes/News/ThumbnailNews';
import HeadlineLoader from '../components/Includes/Shimmer/HeadlineLoader';
import NavBack from '../components/Includes/Navbar/NavTrendingDetail';
import ItemTags from '../components/Includes/news/ItemTags';

// action
import newsAction from '../redux/actions/newsv2Actions';

const InteresTopic = (props) => {
  const [mockData, setMockData] = useState(constMockApi);
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  const navbarRef = useRef(null);
  const [loop, setLoop] = useState(3) 
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
    props.getTagTrending().then((res) => {
      // res.data.length > 0 ? (
      //   res.data.map((item, index) => {
      //     if (index < 4) {
      //       props.getListTag('covid-19')
      //     }
      //   })
      // ) : ''
    })
  },[]);
  return (
    <>
      <Layout title="RCTI+ - News + Tagar">
        <Head>
          {/* <meta name="description" conata.description} />
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
            titleNavbar={'Topik Menarik'}
            disableScrollListener />
        </div>
        <div className="news-interest_wrapper" style={{color: '#ffffff'}}>
          <div className="news-interest_tags">
            {/* <HeadlineLoader /> */}
            <ul>
              {props.listTopic.data_topic.map((item, index) => {
                return (<ItemTags item={item} index={index} key={index}/>)
              })}
            </ul>
          </div>
          {/* <ThumbnailNews /> */}
        </div>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    listTopic: state.newsv2,
  };
}

export default connect(mapStateToProps, {...newsAction})(InteresTopic);

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
