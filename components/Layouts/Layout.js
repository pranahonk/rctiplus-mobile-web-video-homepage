import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { AUTHOR, VIEWPORT, MAIN_DESCRIPTION, OPEN_GRAPH, GTM, GRAPH_SITEMAP, SHARE_BASE_URL, GTM_AUTH, MODE, APPIER_ID } from '../../config';

import Head from "next/head"

const Layout = ({children, ...props}) => {
  return(
    <>
      <Head>
          <title>{props.title || "title"}</title>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#171717" />
          <meta name="msapplication-TileColor" content="#171717" />
          <meta name="msapplication-navbutton-color" content="#171717" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#171717" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />

          <meta name="author" content={AUTHOR} />
          <meta name="viewport" content={VIEWPORT} />
          <meta name="description" content={MAIN_DESCRIPTION} />
          {/* {Object.keys(OPEN_GRAPH).map(og => (<meta key={og} name={'og:' + og} content={OPEN_GRAPH[og]} />))} */}
          <link rel="icon" href="/static/logo/rcti-sm.png?v=1.0" />
          <link rel="manifest" href="/static/manifest.json" />

          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                  'pillar' : 'video'
              });
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${GTM_AUTH}&gtm_preview=${GTM}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WJNRTJP');
          ` }}></script>
          {/* End Google Tag Manager */}
          <script dangerouslySetInnerHTML={{ __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', 'UA-145455301-17', 'auto', 'teamTracker');

              ga('teamTracker.send', 'pageview');
          ` }}></script>

          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <script dangerouslySetInnerHTML={{ __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                  google_ad_client: "ca-pub-7595624984434758",
                  enable_page_level_ads: true
              });
          ` }}></script>
          {/* <script data-ad-client="ca-pub-7595624984434758" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}


          <script src="/static/js/fontawesome.min.js" crossOrigin="anonymous" defer></script>

          {/* <script src="/static/js/jwplayer.js"></script> */}
          <script dangerouslySetInnerHTML={{ __html: `jwplayer.key = "Mh/98M9sROX0uXhFlJwXZYeCxbJD5E1+e2goFcRZ07cI/FTu";` }}></script>
          {/* <script type="text/javascript" src="/statics/js/jwplayer-cstm-btn.min.js" async></script> */}
          <script src="https://cdn.qgraph.io/dist/aiqua-wp.js" ></script>
          <script dangerouslySetInnerHTML={{ __html: `
              AIQUA.init({
                  appId: '${APPIER_ID}',
                  timeout: 5000
              });
          `}}>
          </script>
          <script dangerouslySetInnerHTML={{ __html: `
              window.googletag = window.googletag || {cmd: []};
              googletag.cmd.push(function() {
              // googletag.defineSlot('/21865661642/PRO_MIDDLE_MOBILE', [320, 50], 'div-gpt-ad-1572507979836-0').addService(googletag.pubads());
              // googletag.pubads().enableSingleRequest();
              // googletag.pubads().collapseEmptyDivs();
              // googletag.enableServices();
              });
          ` }}></script>

          {/* Comscore */}
          <script dangerouslySetInnerHTML={{ __html: `
              var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"9013027"}),function(){var c=document.createElement("script"),e=document.getElementsByTagName("script")[0];c.async=!0,c.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",e.parentNode.insertBefore(c,e)}();
          ` }}></script>
          <noscript><img alt="Share" src="https://b.scorecardresearch.com/p?c1=2&amp;c2=9013027&amp;cv=2.0&amp;cj=1" /></noscript>
          {/* End Comscore */}

          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript key="gtm-noscript"><iframe src={`https://www.googletagmanager.com/ns.html?id=GTM-WJNRTJP&gtm_auth=${GTM_AUTH}&gtm_preview=${GTM}&gtm_cookies_win=x`}
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          {/* <!-- End Google Tag Manager (noscript) --> */}

          {/* <!-- Start Alexa Certify Javascript --> */}
          <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
              _atrk_opts = { atrk_acct:"8oNJt1FYxz20cv", domain:"m.rctiplus.com",dynamic: true};
              (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
          ` }}></script>
          <noscript><img src="https://certify.alexametrics.com/atrk.gif?account=8oNJt1FYxz20cv" style={{ display: 'none' }} height="1" width="1" alt="" /></noscript>
          {/* <!-- End Alexa Certify Javascript --> */}

          <script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js"></script>

          <script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-analytics.js"></script>
      </Head>

          {children}
    </>
  )
}

export default Layout