// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
// import { ApplicationInsights } from '@microsoft/applicationinsights-web';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	componentDidMount() {
		console.log(new DeviceUUID().get());
		// const appInsights = new ApplicationInsights({ config: {
		// 	instrumentationKey: '2a8da5df-35c2-4e72-829f-a2fc4ec66f28'
		// 	/* ...Other Configuration Options... */
		// } });
		// appInsights.loadAppInsights();
		// appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
	}

	render() {
		return (
			<Html lang="id" style={{ height: '100%' }}>
				<Head>
					<script src="/static/js/device-uuid.min.js" type="text/javascript"></script>
<<<<<<< HEAD
        			<script src="/static/js/jwplayer.js"></script>
        			<script src="https://je-es.rctiplus.com/assets/js/innoplayer.min.js"></script>
        			<script src="https://je-es.rctiplus.com/vendor/jwplayer-8.25.1/jwplayer.js"></script>
        			{/* <script src="/static/js/jwplayer/jwplayer.js"></script> */}
					{/* <script src="/static/js/ConvivaLivePass_Videojs.min.js"></script> */}
=======
        	<script src=" https://je-es.rctiplus.com/vendor/jwplayer-8.25.1/jwplayer.js"></script>
>>>>>>> fc579c4874a8d7a441ea7c2a557d04efaeeae355
					<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet"></link>
					<script src="https://je-es.rctiplus.com/dist/assets/js/conviva-core-sdk.js"></script>
				</Head>
				<body style={{ height: '100%' }}>
					<Main style={{ height: '100%' }}/>
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
