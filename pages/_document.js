// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	componentDidMount() {
		console.log(new DeviceUUID().get());
	}

	render() {
		return (
			<Html lang="id">
				<Head>
					<script src="/static/js/device-uuid.min.js" type="text/javascript"></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument