import { Provider } from 'react-redux'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import { register, unregister } from 'next-offline/runtime'
import queryString from 'query-string'
import isEmpty from 'lodash/isEmpty'
import { ApolloProvider } from "@apollo/client"

import initStore  from '../redux'
import { setVisitorToken, getVisitorToken } from '../utils/cookie'
import 'sweetalert2/src/sweetalert2.scss'
import '../assets/scss/apps/homepage/default.scss'
import '../assets/scss/responsive.scss'
import '../assets/scss/components/alert.scss'
import { client } from "../graphql/client"

export default withRedux(initStore, { debug: false })(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
          initialProps: {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})},
      }
    }

    state = {
      history: []
    }

    async componentDidMount() {
      const segments = this.props.router.asPath
      let params = {}
      if (segments.length > 1) {
        let qParams = segments.split(/\?/)
        qParams.forEach((row) => {
          params = {...queryString.parse(row)}
        })
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
        window.location.href = process.env.REDIRECT_WEB_DESKTOP + window.location.pathname + window.location.search
      }

      const visitorToken = getVisitorToken()
      if (!visitorToken) await setVisitorToken()

      // lets add initial route to `history`
      this.setState(prevState => ({ history: [...prevState.history, segments] }));
      register()
    }

    componentWillUnmount() {
      unregister()
    }

    render() {
      const { Component, pageProps, store, initialProps } = this.props
      return (
        <ApolloProvider client={client}>
          <Provider store={store}>
            <Component history={this.state.history} {...pageProps} {...initialProps} />
          </Provider>
        </ApolloProvider>
      )
    }
  }
)
