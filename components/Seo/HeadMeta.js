import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { SHARE_BASE_URL, SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config';
import JsonLDVideo from '../Seo/JsonLDVideo'

const HeadMeta = (props) => {
  const router = useRouter()
  const data  = props && props.data && props.data.data;
  const dataPlayer = props && props.dataPlayer && props.dataPlayer.data;
  const meta = props && props.data && props.data.meta;
  const seo = convert(data, data && data.tv_name, dataPlayer, router, meta);
  const keyword = [];
  if(data && data.tag) {
    data && data.tag.map((item) => {
      keyword.push(item.name);
    });
  }
  const contentData = {
			asPath: router.asPath || '',
			title: seo.title || '',
			thumbnailUrl: seo.imagePath || '',
      startDate: data?.release_date || '2021'
		}
  if (data || dataPlayer) {
    return (
      <Head>
        <JsonLDVideo content={contentData} isProgram/>
        <title>{props.seoData?.data?.title ?? seo.title}</title>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="keywords" content={props.seoData?.data?.title ?? keyword.toString() ?? 'rctiplus'} />
        <meta name="apple-mobile-web-app-capable " content="yes" />
        <meta name="title" content={props.seoData?.data?.title ?? seo.title} />
        <meta name="description" content={props.seoData?.data?.description ?? seo.description} />
        <meta property="og:description" content={props.seoData?.data?.description ?? seo.description} />
        <meta property="og:title" content={props.seoData?.data?.title ?? seo.title} />
        <meta property="og:image" itemProp="image" content={seo.imagePath} />
        <meta property="og:url" content={SHARE_BASE_URL + router.asPath}/>
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:type" content={props.ogType || 'website'}/>
        <meta property="og:site_name" content="RCTI+"/>
        <meta property="og:keywords" content={props.seoData?.data?.title ?? keyword.toString() ?? 'rctiplus'} />
        <meta name="twitter:title" content={props.seoData?.data?.title ?? seo.title} />
        <meta name="twitter:description" content={props.seoData?.data?.description ?? seo.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={seo.imagePath} />
        <meta name="twitter:image:alt" content={data && data.title} />
        <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP + router.asPath} />
        <meta name="twitter:creator" content="@RCTIPlus" />
        <meta name="twitter:keywords" content={props.seoData?.data?.title ?? keyword.toString() ?? 'rctiplus'} />
        <meta property="fb:app_id" content="211272363627736" />
        <meta name="twitter:site" content="@RCTIPlus" />
      </Head>
    );
  }
  return (<Head />);
};

export default HeadMeta;

export const convert = (value, tv_name, valueDetail, router, meta) => {
  if (router.query.id && !router.query.content_id) {
    // if (router.query.content_type === 'episode') {
    //   return  {
    //     title: `Nonton Streaming ${valueDetail?.title} Sub Indo - ${SITE_NAME}`, 
    //     description: `Nonton ${value && value.title} Online - Season ${valueDetail && valueDetail.season} - Episode ${valueDetail && valueDetail.episode} - ${SITE_NAME}`,
    //     imagePath: `${meta && meta.image_path}140${valueDetail && valueDetail.portrait_image}`,
    //   };
    // }
    return  {
      title: `Nonton Streaming ${value?.title} Online Sub Indo - ${SITE_NAME}`,
      description: `Nonton streaming online ${value?.title} ${tv_name} full episode lengkap sub indo dengan cuplikan video menarik lainnya hanya di RCTI+  . Lihat selengkapnya disini`,
      imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
    };
  }
  if (router.pathname === '/programs') {
    switch (router.query.content_type || router.query.tab) {
      case 'episodes':
          return  {
            title: `Nonton Streaming ${valueDetail && valueDetail.title} Online Download Full Episode Sub Indo - ${SITE_NAME}`,
            description: `Nonton streaming online ${valueDetail && valueDetail.title} ${valueDetail?.summary}`,
            imagePath: `${meta && meta.image_path}140${valueDetail && valueDetail.program_portrait_image}`,
          };
      case 'episode':
          return  {
            title: `Nonton Streaming ${valueDetail && valueDetail.title} Online Download Full Episode Sub Indo - ${SITE_NAME}`,
            description: `Nonton streaming online ${valueDetail && valueDetail.title} ${valueDetail?.summary}`,
            imagePath: `${meta && meta.image_path}140${valueDetail && valueDetail.program_portrait_image}`,
          };

      case 'extras':
          return  {
            title: `Nonton Video Extra ${value && value.title} Sub Indo - ${SITE_NAME}`,
            description: `Nonton online kumpulan video extra lengkap program ${value && value.title} lengkap dengan kualitas HD Gratis Terlengkap dan Terbaru Sub Indo  Sub Indo - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };

      case 'clips':
          return  {
            title: `Tonton Video Menarik dan Lucu ${value && value.title} Sub Indo - ${SITE_NAME}`,
            description: `Nonton kumpulan potongan video lucu dan menarik dari program ${value && value.title}, ${tv_name} lengkap dengan kualitas HD Gratis Terlengkap dan Terbaru Sub Indo Sub Indo - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };

      case 'photos':
          return  {
            title: `Kumpulan Foto ${value && value.title} - ${SITE_NAME}`,
            description: `Lihat kumpulan foto menarik pemain ${value && value.title}, ${tv_name} - ${SITE_NAME}`,
            imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };
      default:
          return  {
            title: `Nonton Streaming ${value && value.title} Online Sub Indo - ${SITE_NAME}`,
            description: `Nonton streaming online ${value && value.title} ${tv_name} 
              full episode lengkap dengan cuplikan video menarik lainnya hanya di ${SITE_NAME}. 
              Lihat selengkapnya disini`,
              imagePath: `${meta && meta.image_path}140${value && value.portrait_image}`,
          };
    }
  }
};
