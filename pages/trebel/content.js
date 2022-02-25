import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import queryString from 'query-string'

import pageActions from '../../redux/actions/pageActions'
import userActions from '../../redux/actions/userActions'
import searchActions from '../../redux/actions/searchActions'
import { redirectToTrebel, trebelPage } from '../../utils/firebaseTracking'

import Layout from '../../components/Layouts/Default_v2'

import '../../assets/scss/components/explore.scss'

import { VISITOR_TOKEN, DEV_API, SITE_NAME, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP } from '../../config'
import { getCookie, setCookie } from '../../utils/cookie'
import { gaTrackerScreenView } from '../../utils/ga-360'

class TrebelContent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userData: null
    }
    this.platform = null
    this.token = null

    const segments = this.props.router.asPath.split(/\?/)
    if (segments.length > 1) {
      const q = queryString.parse(segments[1])
      if (q.platform) {
        this.platform = q.platform
      }
      if (q.token) {
        this.token = q.token
      }
    }
  }

  static async getInitialProps(ctx) {
    const accessToken = getCookie('ACCESS_TOKEN')

    let resContent = null

    if (ctx.asPath) {
      if (ctx.asPath === '/explores') {
        resContent = await fetch(`${DEV_API}/api/v1/recommendation?page=1&length=1`, {
          method: 'GET',
          headers: {
            'Authorization': accessToken ? accessToken : VISITOR_TOKEN
          }
        })
        resContent = resContent.status === 200 ? await resContent.json() : null
      }
    }

    return {
      query: ctx.query,
      meta_content: resContent
    }
  }

  componentDidMount() {
    let source = this.props.history.length > 0 ? window.location.origin + this.props.history[0] : ''

    if (this.token) setCookie('ACCESS_TOKEN', this.token)

    this.fetchUserData()
    gaTrackerScreenView()
    trebelPage(this.props.user.data, source)
  }

  fetchUserData() {
    const { getUserData } = this.props

    getUserData()
      .then((response) => this.handleSuccessFetchUser(response))
      .catch((error) => this.handleFailedFetchUser(error))
  }

  handleSuccessFetchUser = (payload) => {
    if (payload.status === 200 && payload.data.status.code === 0) {
      this.setState({ userData: payload.data.data })
    }
  }

  handleFailedFetchUser = (error) => {
    console.error('[ERROR] Fetch User: ', error)
  }

  getMetadata() {
    return {
      title: `Nonton Streaming Film Drama Sub Indo, Serial, Sinetron - RCTI+`,
      description: `Nonton kumpulan for you program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
      image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
      keywords: `film sub indo, nonton film, nonton film indonesia, nonton drama korea, nonton sinetron, kumpulan ftv, drama, Realilty Show, Special Event, Variety Show, Sport Hightlight, Music, Talet Search, Match, Documentary, Hard News, Infotainment, Animation, Kids Entertainment, Comedy, Skill / Hobbies, Travel, Action, Horror, Game Show, Sitcom Comedy, Pearch Dialog, Trailer, Talkshow, Crime, TV Magazine, Edutaiment, Sport Hightlight, Quiz, Kids Game Show, Series, Exercise, Light Entertainement, drama indonesia, sinetron indonesia`,
      twitter_img_alt: 'ExploreRCTIPlus'
    }
  }

  getMetaOg() {
    if (Array.isArray(this.props.meta_content?.data) && this.props.meta_content?.data?.length > 0) {
      const [metaOg, imgPath] = [this.props.meta_content.data[0], this.props.meta_content?.meta?.image_path]
      return {
        title: metaOg.title,
        description: metaOg.summary,
        image: `${imgPath}${metaOg.portrait_image}`,
      }
    }
    return {
      title: '',
      description: '',
      image: '',
    }
  }

  encryptUserValue() {
    const { userData } = this.state

    const encryptedData = {
      "key": userData?.id || '',
      "phone": userData?.phone_code + userData?.phone_number || '',
      "email": userData?.email || '',
      "age": userData?.age || '',
      "gender": userData?.gender || '',
      "name": userData?.display_name || ''

    }
    const encodeData = { iv: 'iv', encryptedData}
    
    return Buffer.from(JSON.stringify(encodeData)).toString('base64') // Base64 Encode
  }
  
  onClickSeeMore() {
    const encoded = this.encryptUserValue()

    // Example Decode
    // Buffer.from(base64String, 'base64').toString('utf-8')

    redirectToTrebel(this.props.user.data)
    window.open(`https://trebel.io/partner?data=${encoded}&name=rcti`, "_blank").focus()
  }

  render() {
    const [metadata, ogMetaData] = [this.getMetadata(), this.getMetaOg()]
    
    return (
      <Layout hideFooter title={metadata.title}>
        <Head>
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          <meta property="og:title" content={ogMetaData.title} />
          <meta property="og:description" content={ogMetaData.description} />
          <meta property="og:image" itemProp="image" content={ogMetaData.image} />
          <meta property="og:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="fb:app_id" content={GRAPH_SITEMAP.appId} />
          <meta name="twitter:card" content={GRAPH_SITEMAP.twitterCard} />
          <meta name="twitter:creator" content={GRAPH_SITEMAP.twitterCreator} />
          <meta name="twitter:site" content={GRAPH_SITEMAP.twitterSite} />
          <meta name="twitter:image" content={ogMetaData.image} />
          <meta name="twitter:image:alt" content={metadata.twitter_img_alt} />
          <meta name="twitter:title" content={ogMetaData.title} />
          <meta name="twitter:description" content={ogMetaData.description} />
          <meta name="twitter:url" content={REDIRECT_WEB_DESKTOP + this.props.router.asPath} />
          <meta name="twitter:domain" content={REDIRECT_WEB_DESKTOP} />
        </Head>

        <div id="library-revamp">
          <img src="/static/img/homepage_revamp_trebel.png" width="100%" />
          <div className='containerWrapper'>
            <div className='contentWrapper'>
              <div className='contentTextWrapper'>
                <p className='contentText'>
                  Tanpa <br />
                  <span className='contentTextBold'>Biaya</span>
                </p>
                <p className='contentText'>
                  Tanpa <br />
                  <span className='contentTextBold'>Internet</span>
                </p>
                <p className='contentText'>
                  Tanpa <br />
                  <span className='contentTextBold'>Gangguan</span>
                </p>
              </div>
              <p className='comingSoon'>
                Segera hadir di
                <b>&nbsp;RCTI+</b>
              </p>
            </div>
            <div style={{ marginTop: 16, padding: '0 32px' }}>
              <button onClick={_ => this.onClickSeeMore()}>
                Lihat Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default connect(state => state, {
  ...userActions,
  ...pageActions,
  ...searchActions
})(withRouter(TrebelContent))
