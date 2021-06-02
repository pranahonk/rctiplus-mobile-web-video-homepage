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
		console.log('uuid >>');
		console.log(new DeviceUUID().get());
		// const appInsights = new ApplicationInsights({ config: {
		// 	instrumentationKey: '2a8da5df-35c2-4e72-829f-a2fc4ec66f28'
		// 	/* ...Other Configuration Options... */
		// } });
		// appInsights.loadAppInsights();
		// appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
	}

	render() {
		const {dangerousAsPath} = this.props
		const libNonPillaNews = (!(dangerousAsPath.indexOf('/news') !== -1) && !(dangerousAsPath.indexOf('/dfp') !== -1))
		return (
			<Html lang="id" style={{ height: '100%' }}>
				<Head>
					<script src="/static/js/device-uuid.min.js" type="text/javascript"></script>
        			{libNonPillaNews ? <script type="text/javascript" src="/static/js/jwplayer.js"></script> : null}
					{libNonPillaNews ? <script src="/static/js/conviva-core-sdk.js"></script> : null}
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