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
					{/* <script src="/static/js/ConvivaLivePass_Videojs.min.js"></script> */}
					<script src="/static/js/jwplayer.js"></script>
					<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet"></link>
					<script src="/static/js/conviva-core-sdk.js"></script>
					<script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js"></script>

					<script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-analytics.js"></script>

					{/* <script src="/static/js/firebase.js"></script> */}
					<script dangerouslySetInnerHTML={{ __html: `
						var firebaseConfig = { 
								apiKey: "AIzaSyCFY5ljEzA9bz1jHZ4RTnay1KKE7ysa5Zk",
								authDomain: "rcti-766db.firebaseapp.com",
								databaseURL: "https://rcti-766db.firebaseio.com",
								projectId: "rcti-766db",
								storageBucket: "rcti-766db.appspot.com",
								messagingSenderId: "102225357690",
								appId: "1:102225357690:web:e90f10ab54a010c2",
								measurementId: "G-JR2L0ZYPG7"
							};
							firebase.initializeApp(firebaseConfig);
							firebase.analytics();
                    `}}>
					</script>
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