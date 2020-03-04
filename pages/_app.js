import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { register, unregister } from 'next-offline/runtime';
import { initStore } from '../redux';
import { setNewsToken, setVisitorToken, getVisitorToken } from '../utils/cookie';

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

        componentDidMount() {
            setVisitorToken();
            setNewsToken();
            console.log('VISITOR TOKEN:', getVisitorToken());
            //console.log('NEWS TOKEN:', getNewsToken());

            // 4kuG@nteng

            // DEVELOPMENT
            // conviva.integrate({
            //     key: 'ffc2bacab709e3c5eedc49af6520b33d3c204182',// change this to PROD_CUSTOMER_KEY when you release to production
            //     gateway_host: "rcti-test.testonly.conviva.com", // make sure to remove this line entirely when you release to production
            //     enableAdBreaks: true
            // });

            // PRODUCTION
            conviva.integrate({
                key: 'ff84ae928c3b33064b76dec08f12500465e59a6f',
                enableAdBreaks: true
            });

            console.log('conviva integrated');

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