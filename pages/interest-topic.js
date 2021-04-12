import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router'
import Layout from '../components/Layouts/Default_v2';
import Head from 'next/head';
import queryString from 'query-string';
import dynamic from 'next/dynamic';

import '../assets/scss/components/trending_v2.scss';

// import component
// import ThumbnailNews from '../components/Includes/News/ThumbnailNews';
import TopicLoader from '../components/Includes/Shimmer/TopicLoader';
import NavBack from '../components/Includes/Navbar/NavTrendingDetail';

const ItemTags = dynamic(() => import('../components/Includes/news/ItemTags'))

import { SITEMAP, SITE_NAME, GRAPH_SITEMAP } from '../config';

// action
import newsAction from '../redux/actions/newsv2Actions';

const InteresTopic = (props) => {
  const router = useRouter()
  // const [metaKeyword, setMetaKeyword] = useState(['all tagar'])
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
    props.getTagTrending(100).catch((err) => console.log(err))
    alert('interest Topic >>' + window.location.href)
  },[]);
  return (
    <>
      <Layout title={SITEMAP.topic_tagar.title}>
        <Head>
          <meta name="title" content={SITEMAP.topic_tagar.title}  />
          <meta name="description" content={SITEMAP.topic_tagar.description}  />
          <meta name="keywords" content={'All Tagar'} />
          <meta property="og:title" content={SITEMAP.topic_tagar.title} />
          <meta property="og:image" itemProp="image" content={SITEMAP.topic_tagar.image} />
          <meta property="og:url" content={encodeURI(router.asPath)} />
          <meta property="og:type" content="article" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="fb:app_id" content={SITEMAP.appId} />
          <meta name="twitter:card" content={SITEMAP.twitterCard} />
          <meta name="twitter:creator" content={SITEMAP.twitterCreator} />
          <meta name="twitter:site" content={SITEMAP.twitterSite} />
          <meta name="twitter:image" content={SITEMAP.topic_tagar.image} />
          <meta name="twitter:title" content={SITEMAP.topic_tagar.title} />
          <meta name="twitter:description" content={SITEMAP.topic_tagar.description} />
          <meta name="twitter:url" content={encodeURI(router.asPath)} />
          <meta name="twitter:domain" content={encodeURI(router.asPath)} />
          {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9" />
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
            { props.listTopic.loading ? (constMockApi.fill(true).map((item, index) => (<div key={index}><TopicLoader withList/></div>))) : (<ul>
              {props.listTopic.data_topic.map((item, index) => {
                return (<ItemTags item={item} index={index} key={index + 'item'}/>)
              })}
            </ul>) }
            
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

const constMockApi = new Array(3)
