import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { register, unregister } from 'next-offline/runtime';
import { initStore } from '../redux';
import { setVisitorTokenNews, setNewsTokenV2, setNewsToken, setVisitorToken, getVisitorToken, getVisitorTokenNews, getNewsToken, getNewsTokenV2 } from '../utils/cookie';

import 'sweetalert2/src/sweetalert2.scss';
import '../assets/scss/apps/homepage/default.scss';

import '../assets/scss/components/alert.scss';

export default withRedux(initStore, { debug: false })(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            return {
                pageProps: {
                    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
                }
            };
        }

        async componentDidMount() {
            if(screen.width < 500 ||
                navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPod/i)) {
            } 
            else {
                window.location.href = process.env.REDIRECT_WEB_DESKTOP + window.location.pathname;
            }

            console.log('WILL MOUNT -> SET TOKEN');

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

            console.log('VISITOR TOKEN:', getVisitorToken());
            //console.log('NEWS TOKEN:', getNewsToken());

            // 4kuG@nteng

            // console.log('CONVIVA:', conviva);

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

            // console.log('conviva integrated');
            
            switch (process.env.MODE) {
                case 'DEVELOPMENT':
                    Conviva.LivePass.toggleTraces(true);
                    const settings = {  };
                    settings.gatewayUrl = 'https://rcti-test.testonly.conviva.com';
                    Conviva.LivePass.initWithSettings('ffc2bacab709e3c5eedc49af6520b33d3c204182', settings);
                    break;

                case 'PRODUCTION':
                    Conviva.LivePass.init('ff84ae928c3b33064b76dec08f12500465e59a6f');
                    break;
            }
            

            register();
        }

        componentWillUnmount() {
            unregister();
        }

        render() {
            const { Component, pageProps, store } = this.props;
            // return (
            // 	<Container>
            // 		<Provider store={store}>
            // 			<Component {...pageProps} />
            // 		</Provider>
            // 	</Container>
            // );

            return (
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            );
        }
    }
);