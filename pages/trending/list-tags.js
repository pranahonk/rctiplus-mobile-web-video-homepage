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
import Img from 'react-image';
import { getTruncate } from '../../utils/helpers';
import { formatDateWordID } from '../../utils/dateHelpers';

// import component
// import ThumbnailNews from '../components/Includes/News/ThumbnailNews';
import NavBack from '../../components/Includes/Navbar/NavTrendingDetail';

// action
import newsAction from '../../redux/actions/newsv2Actions';

const Loading = dynamic(() => import('../../components/Includes/Shimmer/ListTagLoader'))


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
  },[]);
  useEffect(() => {
    props.getListTag(router.query.title_tag)
  },[])
  const _moreTags = (pagination) => {
    if(pagination.total > pagination.current_page && !props.contents.isMorePage) {
      props.getMorePage(true)
      props.getListTag(router.query.title_tag, pagination.current_page + 1, true)
    }
  }
  const _arrayLoading = new Array(10).fill('2')
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
            titleNavbar={`#${router.query.title_tag}`}
            disableScrollListener />
        </div>
        <BottomScrollListener offset={500} onBottom={()  => _moreTags(props.contents.data_tag?.meta?.pagination)} />;
        <div className="list_tags_wrapper">
          {props.contents.loading ? (
            _arrayLoading.map((item, index) => (<Loading key={index} />))
            ) : 
            props.contents.data_tag?.data?.map((item, index) => {
              return (
                <div className="list_tags_thumb" key={index + item.title}>
                  <div className="lt_img">
                    {/* <Image
                      src={image.error ? image.fallbackSrc : !image.loaded ? image.fallbackSrc : item.cover}
                      alt="Picture of the author"
                      layout="fill"
                      onLoad={_onImageLoaded}
                      onError={_onImageError}
                      objectFit="cover"
                    /> */}
                    <div className="lt_img_wrap">
                      <Img
                      alt={'null'}
                      unloader={<img src="/static/placeholders/placeholder_landscape.png"/>}
                      loader={<img src="/static/placeholders/placeholder_landscape.png"/>}
                      src={[item.cover, '/static/placeholders/placeholder_landscape.png']}
                      className="news-interest_thumbnail"
                      />
                    </div>
                  </div>
                  <div className="lt_content">
                    <Link href={_goToDetail(item)}>{getTruncate(item.title, '...', 100)}</Link>
                    {/* <h1 onClick={() => _goToDetail(item)}>{getTruncate(item.title, '...', 100)}</h1> */}
                    <div className="lt_content-info">
                      <h5>{item.source}</h5>
                      <h6>{formatDateWordID(new Date(item.pubDate * 1000))}</h6>
                    </div>
                  </div>
                </div>
              );
            })
          }
          {props.contents.isMorePage && (<Loading />)}
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
