import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import Img from 'react-image';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import GetApp from '@material-ui/icons/GetApp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { urlRegex } from '../utils/regex';
import { convivaJwPlayer } from '../utils/conviva';
import queryString from 'query-string';
import {
  fetchDetailProgram, fetchEpisode, fetchSeasonEpisode,
  seasonSelected, fetchRelatedProgram, fetchExtra,
  fetchClip, fetchPhoto, setClearClip,
  setClearExtra, fetchPlayerUrl, clearPlayer,
  fetchBookmark, postBookmark, deleteBookmark,
  fetchLike, postLike, fetchDetailDesc, dataShareSeo, fetchDetailProgramRequest
} from '../redux/actions/program-detail/programDetail';
import { postContinueWatching } from '../redux/actions/historyActions';
import Layout from '../components/Layouts/Default_v2';
import { Nav, NavItem, NavLink, TabContent, TabPane, Collapse } from 'reactstrap';
import '../assets/scss/components/program-detail.scss';
import { RESOLUTION_IMG, VISITOR_TOKEN, DEV_API } from '../config';
import fetch from 'isomorphic-unfetch';
import { getCookie, getVisitorToken } from '../utils/cookie';
import { fetcFromServer } from '../redux/actions/program-detail/programDetail';
import { alertDownload, onTracking, onTrackingClick } from '../components/Includes/program-detail/programDetail';
import { BASE_URL } from '../config';
import userActions from '../redux/actions/userActions';
import VisionPlusProgram from "../components/Includes/program-detail/visionplus_program"

// const Player = dynamic(() => import('../components/Includes/Player/Player'));
const JwPlayer = dynamic(() => import('../components/Includes/Player/JwPlayer'));
const InnoPlayer = dynamic(() => import('../components/Includes/Player/InnoPlayer'));
const HeadMeta = dynamic(() => import('../components/Seo/HeadMeta'));
const MainLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.MainLoader));
const TabListLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.TabListLoader));
const TabPanelLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.TabPanelLoader));
const ButtonOutline = dynamic(() => import('../components/Includes/Common/Button').then((mod) => mod.ButtonOutline));
const ButtonPrimary = dynamic(() => import('../components/Includes/Common/Button').then((mod) => mod.ButtonPrimary));
const ShareIcon = dynamic(() => import('../components/Includes/IconCustom/ShareIcon'));
const PanelEpisode = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelEpisode));
const PanelExtra = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelExtra));
const PanelClip = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelClip));
const PanelPhoto = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelPhoto));
const PanelRelated = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelRelated));
const ActionSheet = dynamic(() => import('../components/Modals/ActionSheet'), { ssr: false });
const ActionMenu = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod)=> mod.ActionMenu), { ssr: false });
const RatedModal = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod)=> mod.RatedModal), { ssr: false });
const Trailer = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod)=> mod.Trailer), { ssr: false });

class Index extends React.Component {
  static async getInitialProps(ctx) {
    const programId = ctx.query.id;
    const accessToken = getCookie('ACCESS_TOKEN');
    const res = await fetch(`${DEV_API}/api/v1/program/${programId}/detail`, {
        method: 'GET',
        headers: {
            'Authorization': accessToken ? accessToken : VISITOR_TOKEN,
        },
    });
    const error_code = res.statusCode > 200 ? res.statusCode : false;
    
    if (error_code) {
        return { server: false, seo_content: false, seo_content_detail: false };
    }
    const data = await res.json();
    if (data.status.code === 1) {
        return { server: false, seo_content: false, seo_content_detail: false };
    }
    let data_2 = null;
    if(ctx.query.content_id) {
      const res_2 = await fetch(`${DEV_API}/api/v1/${ctx.query.content_type}/${ctx.query.content_id}`, {
        method: 'GET',
        headers: {
            'Authorization': accessToken ? accessToken : VISITOR_TOKEN,
        }
      });
      const error_code_2 = res_2.statusCode > 200 ? res_2.statusCode : false;
      data_2 = await res_2.json();
    }

  //   if (error_code_2 || data_2.status.code !== 0) {
  //     return { server: false, seo_content: false, seo_content_detail: false };
  // }

    return { 
      server: {['program-detail']: data},
      seo_content: data, 
      seo_content_detail: data_2,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      init: '',
      transform: 'rotate(0deg)',
      isOpen: false,
      toggle: "",
      season: 1,
      episodeClearStore: false,
      titleProgram: '',
      action_sheet: false,
      rate_modal: false,
      trailer: false,
      title: 'title-program',
      statusProgram: false,
      share_link: "",
      statusError: 0,
      videoIndexing: {},
      activeContentId: 0
    };
    this.type = 'program-detail';
    this.typeEpisode = 'program-episode';
    this.programId = props.router.query.id;
    this.ref = React.createRef();
    this.refMainContent = React.createRef();
    this.refPanelEpisode = React.createRef();
    this.refPanelExtra = React.createRef();
    this.refPanelClip = React.createRef();
    this.refPanelPhoto = React.createRef();
    this.reference = null;
    this.premium = 0;
  }
  componentDidMount() {
    if (!this.props.seo_content) {
      Router.replace('/');
    }
    this.premium = this.props?.server?.[this.type]?.data?.premium
    this.reference = queryString.parse(location.search).ref;
    this.props.dispatch(userActions.getUserData());
    this.props.dispatch(dataShareSeo(this.props.server && this.props.server[this.type] , 'tracking-program'));
    if (this.props.router.query.content_id) {
      const {content_id , content_type} = this.props.router.query;
      this.props.dispatch(fetchDetailDesc(content_id, 'description-player', content_type));
    }
    this.setState({
      episodeClearStore: true,
    }, () => this.loadFirstTab(this.programId));
    this.loadRelated(this.programId,1);

    if (this.props.router.query.content_id) {
      this.setState({ activeContentId: +this.props.router.query.content_id })
      this.props.dispatch(fetchPlayerUrl(this.props.router.query.content_id,'data-player',this.props.router.query.content_type));
    }

    if (this.props.server && this.props.server[this.type].data) {
      console.log(this.props)
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        if (this.props.router.query.content_type === 'extras' || this.props.router.query.content_type === 'extra') {
          this.setState({toggle: 'Extra'});
          this.props.dispatch(fetchExtra(this.programId, 'program-extra'));
          return false;
        }
        if (this.props.router.query.content_type === 'clips' || this.props.router.query.content_type === 'clip') {
          this.setState({toggle: 'Clips'});
          this.props.dispatch(fetchClip(this.programId, 'program-clip'));
          return false;
        }
        if (this.props.router.query.content_type === 'photos' || this.props.router.query.content_type === 'photo') {
          this.setState({toggle: 'Photo'});
          this.props.dispatch(fetchPhoto(this.programId, 'program-photo'));
          return false;
        }
        this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      }
    }

    this.props.dispatch(
      fetchDetailProgram({
        id: this.props.router.query.id,
        filter: "episode",
      })
    )
  }

  shouldComponentUpdate() {
    this.reference = queryString.parse(location.search).ref;
    return true;
  }

  componentDidUpdate(prevProps) {
    this.onRouterChanged()

    if (prevProps.router.query.id !== this.props.router.query.id || prevProps.router.query.content_id !== this.props.router.query.content_id) {
      if (this.props.router.query.content_id) {
        const {content_id , content_type} = this.props.router.query;
        this.props.dispatch(fetchDetailDesc(content_id, 'description-player', content_type));
      }
      this.props.dispatch(dataShareSeo(this.props.server && this.props.server[this.type] && this.props.server[this.type], 'tracking-program'));
      this.loadRelated(this.props.router.query.id,1);
      this.setState({clipClearStore: true, transform: 'rotate(0deg)', isOpen: false}, () => {
            this.loadFirstTab(this.props.router.query.id);
        }
      );
      if (prevProps.router.query.id !== this.props.router.query.id) {
        this.props.dispatch(setClearClip('program-clip'));
        this.props.dispatch(setClearExtra('program-extra'));
        this.props.dispatch(setClearExtra('program-photo'));
        if (this.props.router.query.content_type === 'extra') {
          this.setState({episodeClearStore: true});
        }
        this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      }
      // if (prevProps.router.query.content_type !== this.props.router.query.content_type || prevProps.router.query.tab !== this.props.router.query.tab) {
      //   const id = this.props.router.query.id;
      //   if (this.props.server && this.props.server[this.type].data) {
      //     if (this.isTabs(this.props.server[this.type].data).length > 0) {
      //       if (this.props.router.query.tab === 'extras' || this.props.router.query.content_type === 'extra' || this.props.router.query.content_type === 'extras') {
      //         if (!this.props.data['program-extra']) {this.props.dispatch(fetchExtra(id, 'program-extra'));}
      //         this.setState({toggle: 'Extra'});
      //         return false;
      //       }
      //       if (this.props.router.query.tab === 'clips' || this.props.router.query.content_type === 'clip' || this.props.router.query.content_type === 'clips') {
      //         if (!this.props.data['program-clip']) {this.props.dispatch(fetchClip(id, 'program-clip'));}
      //         {this.setState({toggle: 'Clips'});}
      //         return false;
      //       }
      //       if (this.props.router.query.tab === 'photos' || this.props.router.query.content_type === 'photo' || this.props.router.query.content_type === 'photos') {
      //         if (!this.props.data['program-photo']) {this.props.dispatch(fetchPhoto(id, 'program-photo'));}
      //         {this.setState({toggle: 'Photo'});}
      //         return false;
      //       }
      //       if (this.props.router.query.tab === 'episodes' || this.props.router.query.content_type === 'episode' || this.props.router.query.content_type === 'episodes') {
      //         if (!this.props.data['program-episode']) {
      //           this.props.dispatch(fetchEpisode(id, 'program-episode'));
      //           this.props.dispatch(fetchSeasonEpisode(id,'program-episode'));
      //           this.props.dispatch(seasonSelected(1));
      //         }
      //         {this.setState({toggle: 'Episodes'});}
      //         return false;
      //       }
      //       this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      //     }
      //   }
      // }
    }
  }

  onRouterChanged() {
    const { query } = this.props.router
    let programTypeDetail = this.props.data[`program-${query.content_type}`]
    
    if (!programTypeDetail) return

    const { seasonSelected } = this.props.data
    
    if (!programTypeDetail[`season-${seasonSelected}`]) return
    if (query.content_type === "episode") programTypeDetail = programTypeDetail[`season-${seasonSelected}`]

    const { data, meta } = programTypeDetail
    const { activeContentId } = this.state
    
    if (!data || !meta || !query.content_id) return

    // When currently playing video is not on the list of queue, target to the first content instead
    // Dont fetch or change anything yet when playing video not exist on the queue list
    const isPlayingVideoOnTheList = data.find(content => +content.id === +query.content_id)
    if (!isPlayingVideoOnTheList) {
      const { href, hrefAlias } = this.routingQueryGenerator({ ...data[0], content_type: query.content_type })
      this.props.router.push(`/programs?${href}`, `/programs/${hrefAlias}`)
    }
    
    // Set max video queue length once it has the value from request call
    if (this.state.videoIndexing.maxQueue !== meta.pagination.total) {
      if (this.state.videoIndexing.maxQueue === data.length) return

      this.setState({
        videoIndexing: { ...this.state.videoIndexing, maxQueue: meta.pagination.total }
      })
    }
    
    // Fetch video url everytime it has been pushed to new url
    if (+query.content_id !== activeContentId) {
      this.setState({ activeContentId: +query.content_id })
      this.props.dispatch(fetchPlayerUrl(query.content_id, 'data-player', query.content_type))
    }
  }

  getProgramDetail(id, type) {
    if (!this.props.data[type]) {
      this.props.dispatch(
        fetchDetailProgram({
          id: id,
          filter: type,
        })
      );
    }
  }
  showDetails() {
    this.setState({ details: true });
  }
  getPathImage(path,resolution,imgSrc, status) {
    if (status) {
      return path + resolution + imgSrc;
    } else {
      return '/static/placeholders/placeholder_landscape.png';
    }
  }
  getUrlMainContent(mainData) {
    if (this.props && this.props.data[this.typeEpisode] && this.props.data[this.typeEpisode]['season-1']) {
      const detailData = this.props && this.props.data[this.typeEpisode] && this.props.data[this.typeEpisode]['season-1'].data[0];
      return (
        <>
          {(this.props?.data?.paid_video?.data?.is_paid && this.props?.server['program-detail'].data?.premium === 1) || this.props?.server['program-detail'].data?.premium === 0 ? (<Link
              href={`/programs/${mainData.id}/${urlRegex(mainData.title)}/episode/${detailData.id}/${urlRegex(detailData.title)}${this.reference ? '?ref=' + this.reference : ''}`}
              shallow>
              <a onClick={ () => { 
                this.props.dispatch(fetchPlayerUrl(detailData.id,'data-player','episode'))
                  const dataPlayer = {
                    program_id: this.props && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data && this.props.server['program-detail'].data.id,
                    program_title: this.props && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data && this.props.server['program-detail'].data.title,
                    content_name: this.props && this.props.data && this.props.data['program-episode'] && this.props.data['program-episode']['season-1'] && this.props.data['program-episode']['season-1'].data && this.props.data['program-episode']['season-1'].data.title,
                    content_type: 'episode',
                    id: this.props && this.props.data && this.props.data['program-episode'] && this.props.data['program-episode']['season-1'] && this.props.data['program-episode']['season-1'].data && this.props.data['program-episode']['season-1'].data.id,
                    duration: this.props && this.props.data && this.props.data['program-episode'] && this.props.data['program-episode']['season-1'] && this.props.data['program-episode']['season-1'].data && this.props.data['program-episode']['season-1'].data.duration,
                  }
                  onTrackingClick(null, null, null, 'content_click', null, null, null, dataPlayer, 'mweb_homepage_program_button_play_clicked')
                } }>
                <ButtonOutline icon={<PlayArrowIcon/>} text="Play" />
              </a>
            </Link>) : ''}
          { mainData.trailer_url ? (
            <Link
              href={`/programs?id=${mainData.id}&title=${urlRegex(mainData.title)}`}
              as={`/programs/${mainData.id}/${urlRegex(mainData.title)}${this.reference ? '?ref=' + this.reference : ''}`}
              shallow
            >
            <a onClick={ () => {
              this.setState({ trailer: !this.state.trailer });
                }}>
              <ButtonOutline text="Trailer" />
            </a>
            </Link>
          ) : (<></>) }
        </>
      );
    }
  }
  mainContent() {
    if (this.props.server && this.props.server[this.type].data) {
      const { data, meta } = this.props.server[this.type];
      if (data) {
        const pathImg = [meta.image_path, RESOLUTION_IMG, data.landscape_image];
        return (
          <div className="program-detail-main-wrapper">
            <div className="image--wrapper">
            <Img alt={data.title}
              className="background__program-detail" src={[this.getPathImage(...pathImg, true), this.getPathImage(...pathImg, false)]}
              unloader={<img className="background__program-detail" src={this.getPathImage(...pathImg, false)}/>}
              loader={<img className="background__program-detail" src={this.getPathImage(...pathImg, false)}/>}/>
            </div>
            <div className="player__button--wrapper">
              { this.getUrlMainContent(data) }
            </div>
            <div className="content--wrapper">
              <h1 className="content-title">
                { data.title }
              </h1>
              <div className="content-sub__title">
                <h2>{ data.release_date }</h2>
                <h2>{ data && data.genre.map((s,i) => {
                    let str = s.name;
                    if (i < data.genre.length - 1) {str += ' - ';}
                    return str;
                  }) }</h2>
              </div>
              <div className="content-description">
                <p>{ data.summary }</p>
                <p>Artis: {
                  data && data.starring.map((s,i) => {
                    let str = s.name;
                    if (i < data.starring.length - 1) {str += ', ';}
                    return str;
                  })}</p>
              </div>
            </div>
          </div>
        );
      }
      return (<MainLoader/>);
    }
    return (<MainLoader/>);
  }
  loadRelated(programId, page) {
    const data = {
      id: programId,
      page: page,
      length: 10,
      filter: 'program-related',
    };
    this.props.dispatch(fetchRelatedProgram(data));
  }
  loadFirstTab(programId) {
    this.props.dispatch(fetchBookmark(programId, 'bookmark'));
    this.props.dispatch(fetchLike(programId, 'like', 'program'));
    if (this.props.server && this.props.server[this.type].data) {
      if (this.props.server[this.type].data.category === 'movie') {
        this.props.dispatch(fetchEpisode(programId, 'program-episode', this.props.router.query.content_id));
        this.props.dispatch(fetchSeasonEpisode(programId,'program-episode'));
        this.props.dispatch(seasonSelected(1));
      }
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        switch (this.isTabs(this.props.server[this.type].data)[0]) {
          case 'Episodes':
            if (!this.props.data['program-episode'] || this.state.episodeClearStore) {
              if (this.props.data.seasonSelected) break

              this.props.dispatch(fetchEpisode(programId, 'program-episode', this.props.router.query.content_id));
              this.props.dispatch(fetchSeasonEpisode(programId,'program-episode'));
              this.props.dispatch(seasonSelected(1));
            }
            break;
          case 'Extra':
            if (!this.props.data['program-extra']) {
              this.props.dispatch(fetchExtra(programId, 'program-extra'));
            }
            break;
          case 'Clips':
            if (!this.props.data['program-clip']) {
              this.props.dispatch(fetchClip(programId, 'program-clip'));
            }
            break;
          case 'Photo':
            if (!this.props.data['program-photo']) {
              this.props.dispatch(fetchPhoto(programId, 'program-photo'));
            }
            break;
          default:
            return;
        }
      }
    }
  }
  isTabs(data) {
    const tabs = [];
    if (data && data.episode > 0 && this.props && this.props.server['program-detail'] && this.props.server['program-detail'].data.category === 'series') {tabs.push('Episodes');}
    if (data && data.extra > 0) {tabs.push('Extra');}
    if (data && data.clip > 0) {tabs.push('Clips');}
    if (!this.props.router.query.content_id) {
      if (data && data.photo > 0) {tabs.push('Photo');}
    }
    return tabs;
  }
  tabContent() {
    if (this.props.server && this.props.server[this.type].data) {
      const { data, meta } = this.props.server[this.type];
      if (data && this.isTabs(data).length > 0) {
        return (
          <Nav tabs className="flex-nav">
            {
              this.isTabs(data).map((tab, i) => {
                return (
                  <NavItem key={i} className={classnames({active: this.state.toggle === tab, [tab]: true})}>
                    <NavLink
                    onClick={() => this.setState({ toggle: tab }, () => this.redirect(tab))}>
                      { tab }
                    </NavLink>
                  </NavItem>
                );
              })
            }
              {/* <div className="tab-slider" role="presentation"/> */}
            </Nav>
        );
      }
      if (this.props && this.props.server['program-detail'] && this.props.server['program-detail'].data.category === 'movie') {
        return (<></>);
      }
      return (<TabListLoader/>);
    }
    return (<TabListLoader/>);
  }
  redirect(tab) {
    const { id, title, content_id, content_title, content_type } = this.props.router.query;
    let href, as;
    let convert = this.onTabChange(tab).contentType

    this.setState({ videoIndexing: {} })

    if (!content_id) {
      // href = `/programs/${id}/${urlRegex(title)}/${convert}${this.reference ? '?ref=' + this.reference : ''}`;
      href = `/programs?id=${id}&title=${urlRegex(title)}&tab=${convert}`;
      as = `/programs/${id}/${urlRegex(title)}/${convert}${this.reference ? '?ref=' + this.reference : ''}`;
      Router.push(href, as, { shallow: true });
    }
    // if (content_id) {
    //   // href = `/programs/${id}/${urlRegex(title)}/${content_type}/${content_id}/${urlRegex(content_title)}?${convert + this.reference ? '&ref=' + this.reference : ''}`;
    //   href = `/programs?id=${id}&title=${urlRegex(title)}&content_type=${convert}&content_id=${content_id}&content_title=${urlRegex(content_title)}&tab=${tab}`;
    //   as = `/programs/${id}/${urlRegex(title)}/${convert}/${content_id}/${urlRegex(content_title)}?${convert + this.reference ? '&ref=' + this.reference : ''}`;
    // }
    if (!this.props.data['program-extra'] && convert === 'extra') {
      this.props.dispatch(fetchExtra(id, 'program-extra'));
    }
    if (!this.props.data['program-clip'] && convert === 'clip') {
      this.props.dispatch(fetchClip(id, 'program-clip'));
    }
    if (!this.props.data['program-photo'] && convert === 'photo') {
      this.props.dispatch(fetchPhoto(id, 'program-photo'));
    }
    // Router.push(href, as, { shallow: true });
    onTrackingClick(this.reference, this.props.router.query.id, this.props.server['program-detail'], 'tab_click');
  }

  onTabChange(tabName, page = 1) {
    const { query } = this.props.router
    const { seasonSelected } = this.props.data

    switch(tabName.toLowerCase()) {
      case "episodes":
        return {
          contentType: "episode",
          contentDispatcher: fetchEpisode,
          dispatcherArgs: [ query.id, "program-episode", this.props.router.query.content_id, seasonSelected, page ]
        }
      case "extra":
        return {
          contentType: "extra",
          contentDispatcher: fetchExtra,
          dispatcherArgs: [ query.id, "program-extra", page ]
        }
      case "clips":
        return {
          contentType: "clip",
          contentDispatcher: fetchClip,
          dispatcherArgs: [ query.id, "program-clip", page ]
        }
      case "photo":
        return {
          contentType: "photo",
          contentDispatcher: fetchPhoto,
          dispatcherArgs: [ query.id, "program-photo", page ]
        }
    }
  }

  hasMore(props, page) {
    this.loadRelated(this.props.router.query.id, page);
  }
  getLinkVideo(id, filter, season, type) {
    const vm = this;
    vm.props.dispatch(fetchDetailDesc(id, 'description-player', type));
  }
  addBookmark(id, type) {
    const vm = this;
    vm.props.dispatch(postBookmark(id,type,'bookmark'));
  }
  query() {
    return {
      id: this.props.router.query.id,
      title: this.props.server && this.props.server[this.type].data && this.props.server[this.type].data.title,
    };
  }
  panelEpisode(programEpisode, bookmark) {
    const { loading, loading_episode, loading_more } = this.props.data
    if (loading || loading_episode) {
      return (
        <TabPane tabId="Episodes">
          <TabPanelLoader />
        </TabPane>
      );
    }
    
    const { query } = this.props.router
    const programDetail = this.props.server['program-detail']
    
    if (!programEpisode) return null
    if (((programEpisode.data.length === 0) && programDetail.data.id !== +query.id) && !bookmark) return null

    
    const pagination = {
      ...programEpisode.meta.pagination,
      nextPage: programEpisode.meta.pagination.current_page + 1,
    };
    const dataTracking = {
      ref: this.reference,
      idContent: query.id,
      title: programDetail
    }
    const enableShowMore = {
      isNext: pagination.current_page < pagination.total_page,
      isLoading: loading_more
    }
    return (
      <>
        <PanelEpisode
          ref={this.refPanelEpisode}
          enableShowMore={enableShowMore}
          data={programEpisode}
          query={this.query()}
          link={this.getLinkVideo.bind(this)}
          seasonSelected= { this.props.data.seasonSelected }
          onShowMore={() => this.handleShowMore(pagination, "Episodes")}
          onSeason={() => {this.props.dispatch(fetchSeasonEpisode(query.id,'program-episode',1, pagination.nextPage));}}
          onBookmarkAdd={this.addBookmark.bind(this)}
          onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
          bookmark={bookmark}
          isLogin={this.props.auth.isAuth}
          onShare={(item) => this.toggleActionSheet.bind(this, 'episode', 'content_share', item)}
          dataTracking={dataTracking}
          isActive={query.content_id}
        />
      </>
    );
  }
  panelExtra(programExtra, bookmark) {
    const { loading, loading_extra, loading_more } = this.props.data
    if (loading || loading_extra) {
      return (
        <TabPane tabId="Extra">
          <TabPanelLoader />
        </TabPane>
      );
    }

    const { query } = this.props.router
    const programDetail = this.props.server['program-detail']

    if (((programExtra.data.length === 0) && programDetail.data.id !== +query.id) && !bookmark) return null

    const pagination = {
      ...programExtra.meta.pagination,
      nextPage: programExtra.meta.pagination.current_page + 1,
    }
    const dataTracking = {
      ref: this.reference,
      idContent: query.id,
      title: programDetail
    }
    const enableShowMore = {
      isNext: pagination.current_page < pagination.total_page,
      isLoading: loading_more
    }
    return (
      <PanelExtra
        ref={this.refPanelExtra}
        enableShowMore={enableShowMore}
        onShowMore={() => this.handleShowMore(pagination, "Extra")}
        data={programExtra}
        query={this.query()}
        link={this.getLinkVideo.bind(this)}
        onBookmarkAdd={this.addBookmark.bind(this)}
        onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
        bookmark={bookmark}
        isLogin={this.props.auth.isAuth}
        onShare={(item) => this.toggleActionSheet.bind(this, 'extra', 'content_share', item)}
        dataTracking={dataTracking}
        isActive={this.props.router &&  this.props.router.query.content_id}
      />
    );
  }

  panelClip(programClip, bookmark) {
    const { loading, loading_clip, loading_more } = this.props.data
    if (loading || loading_clip) {
      return (
        <TabPane tabId="Clips">
          <TabPanelLoader />
        </TabPane>
      );
    }

    const { query } = this.props.router
    const programDetail = this.props.server['program-detail']

    if (((programClip.data.length === 0) && programDetail.data.id !== +query.id) && !bookmark) return null
    
    const pagination = {
      ...programClip.meta.pagination,
      nextPage: programClip.meta.pagination.current_page + 1,
    }
    const dataTracking = {
      ref: this.reference,
      idContent: query.id,
      title: programDetail
    }
    const enableShowMore = {
      isNext: pagination.current_page < pagination.total_page,
      isLoading: loading_more
    }
    return (
      <PanelClip
        ref={this.refPanelClip}
        enableShowMore={enableShowMore}
        onShowMore={() => this.handleShowMore(pagination, "Clips")}
        data={programClip}
        query={this.query()}
        link={this.getLinkVideo.bind(this)}
        onBookmarkAdd={this.addBookmark.bind(this)}
        onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
        bookmark={bookmark}
        isLogin={this.props.auth.isAuth}
        onShare={(item) => this.toggleActionSheet.bind(this, 'extra', 'content_share', item)}
        dataTracking={dataTracking}
        isActive={this.props.router &&  this.props.router.query.content_id}
      />
    );
  }

  panelPhoto(programPhoto) {
    const { loading, loading_photo, loading_more } = this.props.data
    if (loading || loading_photo) {
      return (
        <TabPane tabId="Photo">
          <TabPanelLoader />
        </TabPane>
      );
    }

    const { query } = this.props.router
    const programDetail = this.props.server['program-detail']

    if ((programPhoto.data.length === 0) && programDetail.data.id !== +query.id) return null
    
    const pagination = {
      ...programPhoto.meta.pagination,
      nextPage: programPhoto.meta.pagination.current_page + 1,
    }
    const dataTracking = {
      ref: this.reference,
      idContent: query.id,
      title: programDetail
    }
    const enableShowMore = {
      isNext: pagination.current_page < pagination.total_page,
      isLoading: loading_more
    }
    return (
      <PanelPhoto
        ref={this.refPanelPhoto}
        enableShowMore={enableShowMore}
        onShowMore={() => this.handleShowMore(pagination, "Photo")}
        data={programPhoto}
        query={this.query()}
        dataTracking={dataTracking}
      />
    );
  }
  setPlayerDispose(filter) {
    const vm = this;
    vm.props.dispatch(clearPlayer(filter));
  }
  panelRelated(props) {
    if (props && props.data && props.data.length > 0) {
      const pagination = {
        page: props.meta.pagination.current_page,
        total_page: props.meta.pagination.total_page,
        nextPage: props.meta.pagination.current_page + 1,
      };
      return (
        <PanelRelated
          data={ props }
          next={pagination.nextPage}
          hasMore={() => { this.loadRelated(this.props.router.query.id, pagination.nextPage); }}
          hasPlayer={this.setPlayerDispose.bind(this)}
          // eslint-disable-next-line no-undef
          dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
        />
      );
    }
  }

  handleShowMore(pagination, activeTab) {
    console.log("lagi get show more")

    if (pagination.nextPage > pagination.total_page && pagination.total_page > 0) return
    if (activeTab !== this.state.toggle) return

    const { query } = this.props.router

    const { contentDispatcher, dispatcherArgs } = this.onTabChange(activeTab, pagination.nextPage)
    this.props.dispatch(contentDispatcher(...dispatcherArgs))

    onTracking(this.reference, query.id, this.props.server['program-detail']);
  }

  routingQueryGenerator(targetContent) {
    let targetHref = [],
      targetHrefAlias = []

    const query = {
      ...this.props.router.query,
      id: targetContent.program_id,
      content_id: targetContent.id,
      content_title: urlRegex(targetContent.title),
      content_type: targetContent.content_type,
      title: urlRegex(targetContent.program_title)
    }

    for (const key in query) {
      targetHref.push(`${key}=${query[key]}`)
      targetHrefAlias.push(query[key])
    }

    return {
      href: targetHref.join("&"), // actual target url
      hrefAlias: targetHrefAlias.join("/") // url when displayed on browser 
    }
  }

  handleActionBtn(action) {
    const { seasonSelected } = this.props.data
    const { videoIndexing } = this.state
    const { content_type } = this.props.router.query

    let programTypeDetail = this.props.data[`program-${content_type}`]

    if (content_type === "episode") programTypeDetail = programTypeDetail[`season-${seasonSelected}`]

    const { data, meta } = programTypeDetail
    const direction = action === "forward" ? "next" : "prev"
    const targetVideoContent = { ...data[videoIndexing[direction]], content_type }
    const { href, hrefAlias } = this.routingQueryGenerator(targetVideoContent)
    
    // When current video is the last content on the pagination list, request the next page if any
    if ((data.length - 1) === videoIndexing.next) {
      this.handleShowMore({
        ...meta.pagination,
        nextPage: (meta.pagination.current_page + 1)
      }, this.state.toggle)
    }

    this.props.router.push(`/programs?${href}`, `/programs/${hrefAlias}`)
    this.props.dispatch(fetchDetailProgramRequest())
  }

  getCurrentViewingVideoIndex() {
    const { seasonSelected } = this.props.data
    const { id, content_id, content_type } = this.props.router.query
    const programTypeDetail = this.props.data[`program-${content_type}`]
    if (!programTypeDetail) return

    let queueingContents = programTypeDetail.data
    let videoIndexing = this.state.videoIndexing

    if (!programTypeDetail[`season-${seasonSelected}`]) return
    if (content_type === "episode") queueingContents = programTypeDetail[`season-${seasonSelected}`].data

    queueingContents.forEach((content, i) => {
      if (content.id === +content_id && content.program_id === +id) {
        videoIndexing["prev"] = i - 1 < 0 ? 0 : i - 1
        videoIndexing["current"] = i
        videoIndexing["next"] = i + 1 > queueingContents.length - 1 ? queueingContents.length - 1 : i + 1
        videoIndexing["maxQueue"] = i + 1 > queueingContents.length - 1 ? queueingContents.length : videoIndexing["maxQueue"]
        return
      }
    })

    if (this.state.videoIndexing.current !== videoIndexing.current) {
      this.setState({ videoIndexing })
    }
  }

  switchPanel() {
    if (!this.props.router.query.content_id) return this.mainContent()

    if (!this.props.data["data-player"]) {
      return (
        <div className="program-detail-player-wrapper animated fadeInDown go">
            <div>Loading...</div>
        </div>
      )
    }

    const dataPlayer = this.props.data['data-player'];
    
    return (
      <div className="program-detail-player-wrapper">
        <InnoPlayer
          data={dataPlayer && dataPlayer.data } 
          isFullscreen={ dataPlayer && dataPlayer.isFullscreen } 
          ref={this.ref} 
          onResume={(content_id, type, position) => { postContinueWatching(content_id, type, position) }} 
          isResume={true} 
          geoblockStatus={ dataPlayer && dataPlayer.status && dataPlayer.status.code === 12 ? true : false }
          customData= {{
            isLogin: this.props.auth.isAuth, 
            programType: this.props.server && this.props.server[this.type] && this.props.server[this.type].data && this.props.server[this.type].data.program_type_name,
            sectionPage: 'VOD',
          }}
          actionBtn={(e) => this.handleActionBtn(e)}
          videoIndexing={this.state.videoIndexing}
          />
      </div>
    )
  }
  trailer() {
    if (this.props.server && this.props.server[this.type] && this.props.server[this.type]) {
      const data = this.props.server && this.props.server[this.type];
      return (
        <div className="program-detail-player-wrapper trailer">
              <InnoPlayer 
              data={ data.data } 
              ref={this.ref} isFullscreen={ true }
              isResume={true} 
              geoblockStatus={ data && data.status && data.status.code === 12 ? true : false }
              customData= {{
                isLogin: this.props.auth.isAuth, 
                programType: data.program_type_name,
                sectionPage: 'VOD',
                }}
              />
        </div>
      );
    }
    return (
      <div className="program-detail-player-wrapper animated fadeInDown go">
          <div>Loading...</div>
      </div>
    );
  }
  toggleActionSheet(value, trackingType, item = {}) {
    this.setState({
      action_sheet: !this.state.action_sheet,
      statusProgram: value === "program" ? true : false,
      share_link: item.share_link || `${BASE_URL}${this.props.router.asPath}`,
      title: item.title || "title-program"
    })

    if (!this.state.action_sheet) {
      if (this.props.server['program-detail']) {
        onTrackingClick(this.reference, this.props.router.query.id, this.props.server['program-detail'], trackingType, item, value);
      }
    }
    return 'title-program';
  }
  toggleRateModal(test = '') {
    this.setState({ rate_modal: !this.state.rate_modal });
  }

  renderVisionPlusComponent() {
    const programDetail = this.props.data.programDetail.data
    const programEpisode = this.props.data["program-episode"]

    if (!programDetail || !programEpisode) return null
    if (!programDetail.show_vision_plus_disclaimer) return null
    if (this.state.toggle.toLowerCase() !== "episodes") return null

    const { pagination } = programEpisode[`season-${this.props.data.seasonSelected}`].meta

    if (pagination.current_page < pagination.total_page) return null

    return (
      <VisionPlusProgram user={this.props.auth} />
    )
  }

  render() {
    const { props, state } = this;
    const content = props.seo_content_detail?.data

    // set active video index to be used when user click next / back player button
    this.getCurrentViewingVideoIndex()
    return (
      <Layout>
        <HeadMeta data={props.seo_content}
                  dataPlayer={(props.data && props.data['description-player']) || props.seo_content_detail} ogType={'article'}/>
        <div className="program-detail-container animated fadeInDown go">
          <div ref={this.refMainContent} style={{minHeight: '10px'}}>
            { this.switchPanel() }
          </div>
          <div style={ props.router.query.content_id && this.refMainContent !== null ? {
            overflowX: 'hidden',
            overflowY: 'scroll'
          } : {height: 'auto'} }>

            {props.seo_content_detail && 
              <div className="title-player">{content?.episode ? <span>{`E${(content?.episode < 10 ? '0'+content?.episode : ''+content?.episode).slice(0)}:S${(content?.season < 10 ? '0'+content?.season : ''+content?.season).slice(0)} - ${content?.title}`}</span> : <span>{content?.title}</span> }</div>
            }

            <div className="action__button--wrapper">
              <ActionMenu
                onRate={this.toggleRateModal.bind(this)}
                bookmark={props.data && props.data.bookmark}
                like={props.data && props.data.like}
                onLike={(status, filter, type) => this.props.dispatch(postLike(props.router.query.id,type,filter,status))}
                isLogin={this.props.auth.isAuth}
                data={ props.server && props.server['program-detail'] && props.server['program-detail'].data }
                onBookmarkAdd={(id, type) => { this.props.dispatch(postBookmark(id,type, 'bookmark')); }}
                onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
                dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
                />
              <ButtonPrimary 
                className="button-20" 
                icon={ <ShareIcon/> } 
                text="Share" 
                onclick={this.toggleActionSheet.bind(this, 'program', 'program_share', props.data.programDetail.data)}/>
              { this.props.router.query.content_id ? (
                  <>
                    <ButtonPrimary 
                      className="button-20" 
                      icon={ <GetApp/> } 
                      text="Download" 
                      onclick={() => alertDownload()} />
                    <ButtonPrimary 
                      className="button-20"
                      onclick={()=> this.setState({transform: this.state.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)', isOpen: this.state.transform === 'rotate(0deg)' ? true : false}, () => {
                        if(this.state.isOpen) {
                          onTrackingClick(null, null, null, 'content_click', null, null, null, props && props.data && props.data['data-player'] && props.data['data-player'].data, 'mweb_homepage_program_description_clicked')
                        }
                      })}
                      icon={ <KeyboardArrowDown className="arrow-rotate" style={{ transform: this.state.transform }}/> }
                      text="Description"/>
                  </>
                ) : ''
              }
              {!(props.router.query.content_id) && (props?.data?.paid_video?.data?.is_paid) ? 
              (
                <span style={{ width: '100% !important', textAlign: 'right', display: 'inline-block' }}>
                  <div style={{fontSize: 10}}>Expired in <strong>{ props?.data?.paid_video?.data?.order_detail?.expired_in }</strong></div>
                  <div style={{fontSize: 10}}>(counted after first watch)</div>
                </span>
              ) : ''}
            </div>

              <Collapse isOpen={this.state.isOpen}>
                <div className="detail__content-description-wrapper">
                  <div className="content-description">
                      <p>{ props.data &&
                          props.data['description-player'] &&
                          props.data['description-player'].data &&
                          props.data['description-player'].data.summary
                        || '' }</p>
                  </div>
                </div>
              </Collapse>
              <div className="list__content-wrapper">
                <div className="tab__content-wrapper">
                  { this.tabContent() }
                  <TabContent activeTab={this.state.toggle}>
                    { this.panelEpisode(
                        this.props.data &&
                        this.props.data['program-episode'] &&
                        this.props.data['program-episode']['season-' + this.props.data.seasonSelected],
                        this.props.data && this.props.data.bookmark
                        ) }
                    { this.panelExtra(
                      this.props.data &&
                      this.props.data['program-extra'],
                      this.props.data && this.props.data.bookmark
                    ) }
                    { this.panelClip(
                      this.props.data &&
                      this.props.data['program-clip'],
                      this.props.data && this.props.data.bookmark
                    ) }
                    { this.panelPhoto(
                      this.props.data &&
                      this.props.data['program-photo']
                    ) }
                  </TabContent>
                </div>
              </div>

              {this.renderVisionPlusComponent()}
              
              {this.panelRelated(
                this.props.data &&
                this.props.data['program-related']
              )}
          </div>
            { this.state.action_sheet ? (
              <ActionSheet
              toggle={this.toggleActionSheet.bind(this)}
              tabStatus={state.statusProgram ? 'program' :
                        props.router.query.tab ? props.router.query.tab :
                        props.router.query.content_type ? props.router.query.content_type :
                        props.router.pathname
                        }
              caption={state.title}
              url={state.share_link}
              open={state.action_sheet}
              hashtags={props.data && props.data['tracking-program'] && props.data['tracking-program'].data && props.data['tracking-program'].data.tag}
               />
            ) : ''
            }
            <RatedModal
              open={this.state.rate_modal}
              toggle={this.toggleRateModal.bind(this)}
              isLogin={this.props.auth.isAuth}
              like={props.data && props.data.like}
              onLike={(status, filter, type) => this.props.dispatch(postLike(props.router.query.id,type,filter,status))}
             />
            <Trailer
              open={state.trailer}
              toggle={() => {
                this.setState({ trailer: !state.trailer });
                onTrackingClick(this.reference, this.props.router.query.id, this.props.server['program-detail']);
                }}
              player={this.trailer()}
             />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const { Program, user } = state;
  return { data: Program, auth: user };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Index));
