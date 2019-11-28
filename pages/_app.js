import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { register, unregister } from 'next-offline/runtime';
import { initStore } from '../redux';

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
			register();
		}

		componentWillUnmount() {
			unregister();
		}

		render() {
			const { Component, pageProps, store } = this.props;
			return (
				<Container>
					<Provider store={store}>
						<Component {...pageProps} />
					</Provider>
				</Container>
			);
		}
	}
);