import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { register, unregister } from 'next-offline/runtime';
import initStore  from '../redux';
import { setVisitorTokenNews, setNewsTokenV2, setNewsToken, setVisitorToken, getVisitorToken, getVisitorTokenNews, getNewsToken, getNewsTokenV2 } from '../utils/cookie';

import 'sweetalert2/src/sweetalert2.scss';
import '../assets/scss/apps/homepage/default.scss';
import '../assets/scss/responsive.scss';

import '../assets/scss/components/alert.scss';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty'

export default withRedux(initStore, { debug: false })(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            return {
                pageProps: {
                    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
                }
            };
        }

        constructor(props) {
            super(props);
            this.state = {
                history: []
            }
        }

        async componentDidMount() {
            const segments = this.props.router.asPath;
            let params = {}
            if (segments.length > 1) {
                let qParams = segments.split(/\?/)
                qParams.forEach((row) => {
                    params = {...queryString.parse(row)}
                 });
            }
            let condition = (
                screen.width < 500 || (
                    navigator.userAgent.match(/Android/i) ||
                    navigator.userAgent.match(/webOS/i) ||
                    navigator.userAgent.match(/iPhone/i) ||
                    navigator.userAgent.match(/iPod/i) ||
                    navigator.userAgent.match(/iPad/i)
                ) || (
                    !isEmpty(params.device) &&
                    params.device === 'ipad'
                ) || (
                    !isEmpty(params.token)
                ) || (
                    !isEmpty(params.platform) &&
                    params.platform !== 'null' &&
                    params.platform === 'ios'
                )
            )
            if(!condition) {
                window.location.href = process.env.REDIRECT_WEB_DESKTOP + window.location.pathname + window.location.search;
            }

            const visitorTokenNews = getVisitorTokenNews();
            const visitorToken = getVisitorToken();

            let promises = [];
            if (visitorToken == null) {
                promises.push(setVisitorToken());
            }
            if (visitorTokenNews == null) {
                promises.push(setVisitorTokenNews());
            }

            await Promise.all(promises);

            const newsToken = getNewsToken();
            const newsTokenV2 = getNewsTokenV2();

            promises = [];
            if (newsToken == null) {
                promises.push(setNewsToken());
            }
            if (newsTokenV2 == null) {
                promises.push(setNewsTokenV2());
            }

            await Promise.all(promises);

            // setVisitorToken();
            // setNewsToken();

            // setVisitorTokenNews();
            // setNewsTokenV2();
            // 4kuG@nteng

            // switch (process.env.MODE) {
            //     case 'DEVELOPMENT':
            //         // DEVELOPMENT
            //         conviva.integrate({
            //             key: 'ffc2bacab709e3c5eedc49af6520b33d3c204182',// change this to PROD_CUSTOMER_KEY when you release to production
            //             gateway_host: "rcti-test.testonly.conviva.com", // make sure to remove this line entirely when you release to production
            //             enableAdBreaks: true
            //         });
            //         break;

            //     case 'PRODUCTION':
            //         // PRODUCTION
            //         conviva.integrate({
            //             key: 'ff84ae928c3b33064b76dec08f12500465e59a6f',
            //             enableAdBreaks: true
            //         });
            //         break;
            // }

            // switch (process.env.MODE) {
            //     case 'DEVELOPMENT':
            //         // Conviva.LivePass.toggleTraces(true);
            //         // const callbackFunctions = {};
            //         const settings = {  };
            //         settings[Conviva.Constants.GATEWAY_URL] = 'https://rcti-test.testonly.conviva.com';
            //         settings[Conviva.Constants.LOG_LEVEL] = Conviva.Constants.LogLevel.DEBUG;
            //         Conviva.Analytics.init('ffc2bacab709e3c5eedc49af6520b33d3c204182', null, settings);
            //         // conviva.integrate({
            //         //     key: 'ffc2bacab709e3c5eedc49af6520b33d3c204182',// change this to PROD_CUSTOMER_KEY when you release to production
            //         //     gateway_host: "rcti-test.testonly.conviva.com", // make sure to remove this line entirely when you release to production
            //         //     enableAdBreaks: true,
            //         // });
            //         break;

            //     case 'PRODUCTION':
            //         // conviva.integrate({
            //         //     key: 'ff84ae928c3b33064b76dec08f12500465e59a6f',
            //         //     enableAdBreaks: true,
            //         // });
            //         Conviva.Analytics.init('ff84ae928c3b33064b76dec08f12500465e59a6f');
            //         break;
            // }

            // lets add initial route to `history`
            this.setState(prevState => ({ history: [...prevState.history, segments] }));
            
            register();
        }

        componentWillUnmount() {
            unregister();
        }

        render() {
            const { Component, pageProps, store } = this.props;
            // return (
            //  <Container>
            //      <Provider store={store}>
            //          <Component {...pageProps} />
            //      </Provider>
            //  </Container>
            // );

            return (
                <Provider store={store}>
                    <Component history={this.state.history} {...pageProps} />
                </Provider>
            );
        }
    }
);
