import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { register, unregister } from 'next-offline/runtime';
import { initStore } from '../redux';
import { setNewsToken, setVisitorToken, getVisitorToken, getNewsToken } from '../utils/cookie';

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
			console.log('NEWS TOKEN:', getNewsToken());
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