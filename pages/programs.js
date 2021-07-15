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
  fetchLike, postLike, fetchDetailDesc, dataShareSeo,
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

// const Player = dynamic(() => import('../components/Includes/Player/Player'));
const JwPlayer = dynamic(() => import('../components/Includes/Player/JwPlayer'));
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
    // console.log('on server')
    const programId = ctx.query.id;
    console.log(`ini program id`, programId)
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
      toggle: 0,
      season: 1,
      episodeClearStore: false,
      titleProgram: '',
      action_sheet: false,
      rate_modal: false,
      trailer: false,
      title: 'title-program',
      statusProgram: false,
      statusError: 0,
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
    this.premium = this.props?.server?.[this.type]?.data?.premium
    this.reference = queryString.parse(location.search).ref;
    // console.log('MOUNTED: ', this.props);
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
  }
  shouldComponentUpdate() {
    // console.log('COMPONENT UPDATE');
    this.reference = queryString.parse(location.search).ref;
    return true;
  }
	// componentWillUnmount() {
	// 	if (window.convivaVideoAnalytics) {
	// 		const convivaTracker = convivaJwPlayer();
	// 		convivaTracker.cleanUpSession();
	// 	}
	// }
  UNSAFE_componentWillReceiveProps(nextProps) {
  }
  componentDidUpdate(prevProps) {
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
              this.setState({ trailer: !this.state.trailer }, () => {
                {/* this.props.dispatch(fetchPlayerUrl(mainData.id,'data-player','episode', true)) */}
                  });
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
        this.props.dispatch(fetchEpisode(programId, 'program-episode'));
        this.props.dispatch(fetchSeasonEpisode(programId,'program-episode'));
        this.props.dispatch(seasonSelected(1));
      }
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        switch (this.isTabs(this.props.server[this.type].data)[0]) {
          case 'Episodes':
            if (!this.props.data['program-episode'] || this.state.episodeClearStore) {
              this.props.dispatch(fetchEpisode(programId, 'program-episode'));
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
    let convert = '';
    console.log(tab)
    if (tab === 'Episodes') {convert = 'episode';}
    if (tab === 'Extra') {convert = 'extra';}
    if (tab === 'Clips') {convert = 'clip';}
    if (tab === 'Photo') {convert = 'photo';}
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
  hasMore(props, page) {
    this.loadRelated(this.props.router.query.id, page);
  }
  getLinkVideo(id, filter, season, type) {
    const vm = this;
    vm.props.dispatch(fetchDetailDesc(id, 'description-player', type));
    vm.props.dispatch(fetchPlayerUrl(id,filter,type));
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
  panelEpisode(props, bookmark) {
    if (!this.props.data.loading_episode && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data) {
      if (((props && props.data && props.data.length > 0) &&
      // eslint-disable-next-line radix
      this.props.server['program-detail'].data.id === parseInt(this.props.router.query.id)) && bookmark) {
        const pagination = {
          page: props.meta.pagination.current_page,
          total_page: props.meta.pagination.total_page,
          nextPage: props.meta.pagination.current_page + 1,
        };
        return (
          <>
            <PanelEpisode
              ref={this.refPanelEpisode}
              enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
              data={props}
              query={this.query()}
              link={this.getLinkVideo.bind(this)}
              seasonSelected= { this.props.data.seasonSelected }
              onShowMore={() => {
                console.log("lagi get show more")
                this.props.dispatch(fetchEpisode(this.props.router.query.id, 'program-episode',props.data[0].season, pagination.nextPage));
                onTracking(this.reference, this.props.router.query.id, this.props.server['program-detail']);
                }}
              onSeason={() => {this.props.dispatch(fetchSeasonEpisode(this.props.router.query.id,'program-episode',1, pagination.nextPage));}}
              onBookmarkAdd={this.addBookmark.bind(this)}
              onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
              bookmark={bookmark}
              isLogin={this.props.auth.isAuth}
              onShare={(title, item) => this.toggleActionSheet.bind(this, 'episode', title, 'content_share', item)}
              dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
              isActive={this.props.router &&  this.props.router.query.content_id}
            />
          </>
          );
      }
    }

    return (
      <TabPane tabId="Episodes">
        <TabPanelLoader />
      </TabPane>
    );
  }
  panelExtra(props, bookmark) {
    if (!this.props.data.loading_extra && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data) {
      if ((props && props.data && props.data.length > 0) &&
        (this.props.server['program-detail'].data.id === parseInt(this.props.router.query.id)) && bookmark) {
      const pagination = {
        page: props.meta.pagination.current_page,
        total_page: props.meta.pagination.total_page,
        nextPage: props.meta.pagination.current_page + 1,
      };
      return (
      <PanelExtra
        ref={this.refPanelExtra}
        enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
        onShowMore={() => { this.props.dispatch(fetchExtra(this.props.router.query.id, 'program-extra',pagination.nextPage)); }}
        data={props}
        query={this.query()}
        link={this.getLinkVideo.bind(this)}
        onBookmarkAdd={this.addBookmark.bind(this)}
        onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
        bookmark={bookmark}
        isLogin={this.props.auth.isAuth}
        onShare={(title, item) => this.toggleActionSheet.bind(this, 'extra', title, 'content_share', item)}
        dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
        isActive={this.props.router &&  this.props.router.query.content_id}
      />
        );
      }
    }
    return (
      <TabPane tabId="Extra">
        <TabPanelLoader />
      </TabPane>
    );
  }
  panelClip(props, bookmark) {
    if (!this.props.data.loading_clip && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data) {
      if ((props && props.data && props.data.length > 0) &&
      (this.props.server['program-detail'].data.id === parseInt(this.props.router.query.id)) && bookmark) {
      const pagination = {
        page: props.meta.pagination.current_page,
        total_page: props.meta.pagination.total_page,
        nextPage: props.meta.pagination.current_page + 1,
      };
      return (
      <PanelClip
        ref={this.refPanelClip}
        enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
        onShowMore={() => { this.props.dispatch(fetchClip(this.props.router.query.id, 'program-clip',pagination.nextPage)); }}
        data={props}
        query={this.query()}
        link={this.getLinkVideo.bind(this)}
        onBookmarkAdd={this.addBookmark.bind(this)}
        onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
        bookmark={bookmark}
        isLogin={this.props.auth.isAuth}
        onShare={(title, item) => this.toggleActionSheet.bind(this, 'extra', title, 'content_share', item)}
        dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
        isActive={this.props.router &&  this.props.router.query.content_id}
      />
        );
    }
  }
    return (
      <TabPane tabId="Clips">
        <TabPanelLoader />
      </TabPane>
    );
  }
  panelPhoto(props) {
    if (!this.props.data.loading_photo && this.props.server && this.props.server['program-detail'] && this.props.server['program-detail'].data) {
      if ((props && props.data && props.data.length > 0)
        && (this.props.server['program-detail'].data.id === parseInt(this.props.router.query.id))) {
            const pagination = {
              page: props.meta.pagination.current_page,
              total_page: props.meta.pagination.total_page,
              nextPage: props.meta.pagination.current_page + 1,
            };
            return (
            <PanelPhoto
              ref={this.refPanelPhoto}
              enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
              onShowMore={() => { this.props.dispatch(fetchPhoto(this.props.router.query.id, 'program-photo',pagination.nextPage)); }}
              data={props}
              query={this.query()}
              dataTracking={{ref: this.reference, idContent: this.props.router.query.id, title: this.props.server['program-detail']}}
            />
      );
        }
    }
    return (
      <TabPane tabId="Photo">
        <TabPanelLoader />
      </TabPane>
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

  handleActionBtn(action) {
    const { id, content_id } = this.props.router.query
    const { seasonSelected } = this.props.data
    const queueingContents = this.props.data["program-episode"][`season-${seasonSelected}`].data
    
    let targetVideoIndex = 0,
      targetHref = [],
      targetHrefAlias = [],
      targetVideoContent = null

    queueingContents.forEach((video, i) => {
      if (video.id === +content_id && video.program_id === +id) {
        targetVideoIndex = i
        return
      }
    })

    switch(action) {
      case "forward": 
        if (!queueingContents[targetVideoIndex + 1]) break
        targetVideoContent = queueingContents[targetVideoIndex + 1]
        break
      case "backward":
        if (!queueingContents[targetVideoIndex - 1]) break
        targetVideoContent = queueingContents[targetVideoIndex - 1]
        break
    }

    if (!targetVideoContent) return

    const query = {
      ...this.props.router.query,
      id: targetVideoContent.program_id,
      content_id: targetVideoContent.id,
      content_title: urlRegex(targetVideoContent.title),
      content_type: targetVideoContent.type,
      title: urlRegex(targetVideoContent.program_title)
    }

    for (const key in query) {
      targetHref.push(`${key}=${query[key]}`)
      targetHrefAlias.push(query[key])
    }

    this.props.dispatch(fetchPlayerUrl(targetVideoContent.id, 'data-player', targetVideoContent.type));
    this.props.router.push(`/programs?${targetHref.join("&")}`, `/programs/${targetHrefAlias.join("/")}`)
  }

  switchPanel() {
    if (this.props.router.query.content_id) {
      if (this.props.data && this.props.data['data-player']) {
        const data = this.props.data && this.props.data['data-player'];

        if (this.props.data["program-episode"] && this.props.data["program-episode"][`season-${this.props.data.seasonSelected}`].data) {
          console.log(this.props.data["program-episode"][`season-${this.props.data.seasonSelected}`].data)
        }

        
        return (
          <div className="program-detail-player-wrapper">
              <JwPlayer
                data={data && data.data } 
                isFullscreen={ data && data.isFullscreen } 
                ref={this.ref} 
                onResume={(content_id, type, position) => { postContinueWatching(content_id, type, position) }} 
                isResume={true} 
                geoblockStatus={ data && data.status && data.status.code === 12 ? true : false }
                customData= {{
                  isLogin: this.props.auth.isAuth, 
                  programType: this.props.server && this.props.server[this.type] && this.props.server[this.type].data && this.props.server[this.type].data.program_type_name,
                  sectionPage: 'VOD',
                }}
                actionBtn={(e) => this.handleActionBtn(e)}
                />
              {/* <Player data={ data.data } isFullscreen={ data.isFullscreen } ref={this.ref} /> */}
          </div>
        );
      }
      return (
        <div className="program-detail-player-wrapper animated fadeInDown go">
            <div>Loading...</div>
        </div>
      );
    }
    return (
      this.mainContent()
    );
  }
  trailer() {
    if (this.props.server && this.props.server[this.type] && this.props.server[this.type]) {
      const data = this.props.server && this.props.server[this.type];
      return (
        <div className="program-detail-player-wrapper trailer">
            <JwPlayer 
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
            {/* <Player data={ data.data } ref={this.ref} isFullscreen={ true }/> */}
        </div>
      );
    }
    return (
      <div className="program-detail-player-wrapper animated fadeInDown go">
          <div>Loading...</div>
      </div>
    );
  }
  toggleActionSheet(value, title = 'title-program', trackingType, item) {
    const { props, state } = this;
    this.setState({
      action_sheet: !this.state.action_sheet,
    });
    if (value === 'program') {
      this.setState({title: props.data && props.data['tracking-program'] && props.data['tracking-program'].data && props.data['tracking-program'].data.title, statusProgram: true});
    }
    if (value === 'episode') {
      this.setState({title: title, statusProgram: false});
    }
    if (value === 'extra') {
      this.setState({title: title, statusProgram: false});
    }
    if (value === 'clip') {
      this.setState({title: title, statusProgram: false});
    }
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
  // statusLogin(data) {
  //   let isLogin = false;
  //   if (data && data.status) {
  //     isLogin = data.status.code === 13 ? false : true;
  //     return isLogin;
  //   }
  // }
  render() {
    const { props, state } = this;
    const content = props.seo_content_detail?.data
   
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
              <ButtonPrimary className="button-20" icon={ <ShareIcon/> } text="Share" onclick={this.toggleActionSheet.bind(this, 'program', null, 'program_share')}/>
              { this.props.router.query.content_id ? (
                <>
                  <ButtonPrimary className="button-20" icon={ <GetApp/> } text="Download" onclick={() => alertDownload()} />
                  <ButtonPrimary className="button-20"
                  onclick={()=> this.setState({transform: this.state.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)', isOpen: this.state.transform === 'rotate(0deg)' ? true : false}, () => {
                    if(this.state.isOpen) {
                      onTrackingClick(null, null, null, 'content_click', null, null, null, props && props.data && props.data['data-player'] && props.data['data-player'].data, 'mweb_homepage_program_description_clicked')
                    }
                  })}
                  icon={ <KeyboardArrowDown className="arrow-rotate" style={{ transform: this.state.transform }}/> }
                  text="Description"
                  />
                </>) : '' }
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
              url={BASE_URL + props.router.asPath}
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
