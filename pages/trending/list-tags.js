import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { urlRegex } from '../../utils/regex';
import Layout from '../../components/Layouts/Default_v2';
import Head from 'next/head';
import queryString from 'query-string';
import BottomScrollListener from 'react-bottom-scroll-listener';
import '../../assets/scss/components/trending_v2.scss';
// import Image from 'next/image';
import { SITEMAP, SITE_NAME, GRAPH_SITEMAP } from '../../config';

// import component
// import ThumbnailNews from '../components/Includes/News/ThumbnailNews';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';

// action
import newsAction from '../../redux/actions/newsv2Actions';

const Loading = dynamic(() => import('../../components/Includes/Shimmer/ListTagLoader'))
const SquareItem = dynamic(() => import('../../components/Includes/news/SquareItem'),{loading: () => <Loading />})


// Import Swiper styles
import 'swiper/swiper.scss';

const ListTags = (props) => {
  const [image, setImage] = useState({
    fallbackSrc: '/static/placeholders/placeholder_landscape.png',
    error: false,
    loaded: false,
  })
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  const navbarRef = useRef(null);
  const router = useRouter()
  const _onImageLoaded = () => {
    setImage({...image , loaded: true, test: 'loaded'});
  }
  const _onImageError = () => {
    setImage({...image , error: true, test: 'error'})
  }
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
    props.getListTag(router.query.title_tag)
    props.incrementCountTag(router.query.title_tag)
  },[]);
  const _moreTags = (pagination) => {
    if(pagination.total > pagination.current_page && !props.contents.isMorePage) {
      props.getMorePage(true)
      props.getListTag(router.query.title_tag, pagination.current_page + 1, true)
    }
  }
  const _arrayLoading = new Array(10).fill('2')
  const metaTitle = `Berita Terpopular dari tagar ${router.query.title_tag} - RCTI+`
  const _goToDetail = (article) => {
        let category = ''
        if (article.subcategory_name.length < 1) {
          category = 'berita-utama';
        } else {
          category = urlRegex(article.subcategory_name)
        }
        return ('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
    }
  return (
    <>
      <Layout title={metaTitle}>
        <Head>
          <meta name="title" content={metaTitle}  />
          <meta name="description" content={SITEMAP.topic_tagar.description}  />
          <meta name="keywords" content={'All Tagar'} />
          <meta property="og:title" content={metaTitle} />
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
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:image:alt" content={'NewsRCTIPlus'} />
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
            titleNavbar={`#${router.query.title_tag}`}
            disableScrollListener />
        </div>
        <BottomScrollListener offset={500} onBottom={()  => _moreTags(props.contents.data_tag?.meta?.pagination)} />;
        <div className="list_tags_wrapper">
          <div className="item_square-wrapper">
            {props.contents.loading ? (
              _arrayLoading.map((item, index) => (<Loading key={index} />))
              ) : 
              props.contents.data_tag?.data?.map((item, index) => {
                return (
                  <SquareItem key={index + item.title} indexKey={index} item={item} assets_url={props.contents.data_tag?.meta?.assets_url} />
                );
              })
            }
            {props.contents.isMorePage && (<Loading />)}
          </div>
        </div>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    contents: state.newsv2,
  }
}

export default connect(mapStateToProps, { ...newsAction })(ListTags);
