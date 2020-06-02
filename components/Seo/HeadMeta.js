import React from 'react';
import Head from 'next/head';
import { SHARE_BASE_URL, SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';

const HeadMeta = (props) => {
  const data  = props && props.data && props.data.data;
  const dataPlayer = props && props.dataPlayer && props.dataPlayer.data;
  const meta = props && props.data && props.data.meta;
  const seo = convert(data, data && data.tv_name, dataPlayer, props.router, meta);
  const keyword = [];
  data && data.tag.map((item) => {
    keyword.push(item.name);
  });

  if (data || dataPlayer) {
    return (
      <Head>
        <title>{seo.title}</title>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="keywords" content={keyword.toString() || 'rctiplus'} />
        <meta name="apple-mobile-web-app-capable " content="yes" />
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:image" itemProp="image" content={seo.imagePath} />
        <meta property="og:url" content={SHARE_BASE_URL + props.router.asPath}/>
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="RCTI+"/>
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={seo.imagePath} />
        <meta name="twitter:image:alt" content={data && data.title} />
        <meta name="twitter:creator" content="@RCTIPlus" />
        <meta property="fb:app_id" content="211272363627736" />
        <meta name="twitter:site" content="@RCTIPlus" />
      </Head>
    );
  }
  return (<Head />);
};

export default HeadMeta;

export const convert = (value, tv_name, valueDetail, router, meta) => {
  if (router.query.id && router.query.content_id) {
    if (router.query.content_type === 'episode') {
      return  {
        title: `${valueDetail ? valueDetail.title : ''} - ${SITE_NAME}`,
        description: `Nonton ${value && value.title} Online - Season ${valueDetail && valueDetail.season} - Episode ${valueDetail && valueDetail.episode} - ${SITE_NAME}`,
        imagePath: `${meta && meta.image_path}140${valueDetail && valueDetail.portrait_image}`,
      };
    }
    return  {
      title: `${valueDetail ? valueDetail.title : 'Nonton Streaming Program Online'} - ${SITE_NAME}`,
      description: `${valueDetail && valueDetail.title} - ${value && value.title} - ${SITE_NAME}`,
      imagePath: `${meta && meta.image_path}140${valueDetail && valueDetail.portrait_image}`,
    };
  }
  if (router.pathname === '/programs') {
    switch (router.query.tab || router.query) {
      case 'episodes':
          return  {
            title: `Nonton ${value && value.title} Online Full Episode - ${SITE_NAME}`,
            description: `Kumpulan cuplikan video ${value && value.title} ${tv_name} online per episode lengkap hanya di ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };

      case 'extras':
          return  {
            title: `Nonton Video Extra Program ${value && value.title} Lainnya - ${SITE_NAME}`,
            description: `Nonton online kumpulan video extra lengkap program ${value && value.title} - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };

      case 'clips':
          return  {
            title: `Tonton Potongan Video Menarik dan Lucu ${value && value.title} - ${SITE_NAME}`,
            description: `Nonton kumpulan potongan video lucu dan menarik dari program ${value && value.title}, ${tv_name} - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };

      case 'photos':
          return  {
            title: `Tonton Potongan Video Menarik dan Lucu ${value && value.title} - ${SITE_NAME}`,
            description: `Lihat kumpulan foto menarik para pemain dan artis ${value && value.title}, ${tv_name} - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };
      default:
          return  {
            title: `Nonton Streaming Program ${value && value.title} Online - ${SITE_NAME}`,
            description: `Nonton streaming online ${value && value.title} ${tv_name} 
              full episode lengkap dengan cuplikan video menarik lainnya hanya di ${SITE_NAME}. 
              Lihat selengkapnya disini`,
              imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };
    }
  }
};
