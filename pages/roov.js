import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Head from 'next/head';
import initialize from '../utils/initialize';
import Layout from '../components/Layouts/Default_v2';
import Footer_v2 from '../components/Includes/Footer/Default_v2';
import NavDefault_v2 from '../components/Includes/Navbar/NavDefault_v2';

import { SITEMAP, AUTHOR, VIEWPORT, MAIN_DESCRIPTION, OPEN_GRAPH } from '../config';

// import '../assets/scss/components/radio.scss';

class Roov extends React.Component {

    static async getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
            src: 'https://rctiplus.roov.id/',
            status: 'home',
        };
    }
    componentDidMount() {
        console.log('TESTT', this.iframe.src)
        if(this.props.router.query.search === 'search') {
            this.setState({ src: 'https://rctiplus.roov.id/search', status: 'search' })
        }
    }
    componentDidUpdate() {
        console.log(this.props)
    }

    render() {
        return (
            // <Layout title={SITEMAP.home.title}>
            <div>
                <Head>
                    <title>{SITEMAP.home.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#171717" />
                    <meta name="msapplication-TileColor" content="#171717" />
                    <meta name="msapplication-navbutton-color" content="#171717" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />

                    <meta name="author" content={AUTHOR} />
                    <meta name="viewport" content={VIEWPORT} />
                    <meta name="description" content={MAIN_DESCRIPTION} />
                    {Object.keys(OPEN_GRAPH).map(og => (<meta key={og} name={'og:' + og} content={OPEN_GRAPH[og]} />))}
                    <link rel="icon" href="/static/logo/rcti-sm.png?v=1.0" />
                    <link rel="manifest" href="/static/manifest.json" />
                    <link rel="canonical" href={`http://www.rctiplus.com/radio`}></link>
                    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;lang=en" />

                    {/* Google Tag Manager */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            'pilar' : 'news'
                        });

                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
                        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}
                        )(window,document,'script','dataLayer','GTM-WJNRTJP');
                    ` }}></script>
                    {/* End Google Tag Manager */}

                    {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        (adsbygoogle = window.adsbygoogle || []).push({
                            google_ad_client: "ca-pub-8248966892082355",
                            enable_page_level_ads: true
                        });
                    ` }}></script> */}


                    <script src="/static/js/fontawesome.min.js" crossOrigin="anonymous" defer></script>

                    <script src="https://cdn.qgraph.io/dist/aiqua-wp.js" ></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        AIQUA.init({
                            appId: 'c63c2960bf562e9ec2de',
                            timeout: 5000
                        });
                    `}}>
                    </script>

                    {/* Comscore */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"9013027"}),function(){var c=document.createElement("script"),e=document.getElementsByTagName("script")[0];c.async=!0,c.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",e.parentNode.insertBefore(c,e)}();
                    ` }}></script>
                    <noscript><img alt="Share" src="https://b.scorecardresearch.com/p?c1=2&amp;c2=9013027&amp;cv=2.0&amp;cj=1" /></noscript>
                    {/* End Comscore */}

                    {/* <!-- Google Tag Manager (noscript) --> */}
                    <noscript key="gtm-noscript"><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5F9P7H3"
                        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
                    {/* <!-- End Google Tag Manager (noscript) --> */}

                    {/* <!-- Start Alexa Certify Javascript --> */}
                    <script type="text/javascript" dangerouslySetInnerHTML={{
                        __html: `
                        _atrk_opts = { atrk_acct:"8oNJt1FYxz20cv", domain:"m.rctiplus.com",dynamic: true};
                        (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
                    ` }}></script>
                    <noscript><img src="https://certify.alexametrics.com/atrk.gif?account=8oNJt1FYxz20cv" style={{ display: 'none' }} height="1" width="1" alt="" /></noscript>
                    {/* <!-- End Alexa Certify Javascript --> */}

                    <script type="text/javascript" dangerouslySetInnerHTML={{
                        __html: `
                        !function(q,g,r,a,p,h,js) {
                            if(q.qg)return;
                            js = q.qg = function() {
                            js.callmethod ? js.callmethod.call(js, arguments) : js.queue.push(arguments);
                            };
                            js.queue = [];
                            p=g.createElement(r);p.async=!0;p.src=a;h=g.getElementsByTagName(r)[0];
                            h.parentNode.insertBefore(p,h);
                        } (window,document,'script','//cdn.qgr.ph/qgraph.c63c2960bf562e9ec2de.js');
                    ` }}></script>
                </Head>
                {this.state.status !== 'search' ? (<NavDefault_v2 disableScrollListener />) : '' }
                <iframe 
                    ref={ref => this.iframe = ref} 
                    src={this.state.src} 
                    frameBorder="0" 
                    style={{ width: '100%', minHeight: 'calc(100vh - 47px)', marginTop: this.state.status !== 'search' ? 43 : 0}}
                    onLoad={console.log(this.iframe)}></iframe>
                <Footer_v2 />
            </div>
            // </Layout>
        );
    }

}

export default connect(state => state, {})(withRouter(Roov));