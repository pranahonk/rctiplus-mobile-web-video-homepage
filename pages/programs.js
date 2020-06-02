import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import Img from 'react-image';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayListAdd from '@material-ui/icons/PlayListAdd';
import PlayListAddCheck from '@material-ui/icons/PlayListAddCheck';
import GetApp from '@material-ui/icons/GetApp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { urlRegex } from '../utils/regex';
import {
  fetchDetailProgram, fetchEpisode, fetchSeasonEpisode,
  seasonSelected, fetchRelatedProgram, fetchExtra,
  fetchClip, fetchPhoto, setClearClip,
  setClearExtra, fetchPlayerUrl, clearPlayer,
  fetchBookmark, postBookmark, deleteBookmark,
  fetchLike, postLike, fetchDetailDesc, dataShareSeo,
} from '../redux/actions/program-detail/programDetail';
import Layout from '../components/Layouts/Default_v2';
import { Button, Col, Nav, NavItem, NavLink, TabContent, TabPane, Collapse } from 'reactstrap';
import '../assets/scss/components/program-detail.scss';
import { BASE_URL, DEV_API, VISITOR_TOKEN, SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../config';
import { fetcFromServer } from '../redux/actions/program-detail/programDetail';
import { alertDownload, alertSignIn } from '../components/Includes/program-detail/programDetail';
const Player = dynamic(() => import('../components/Includes/Player/Player'));
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

class Index extends React.Component {
  static getInitialProps({store, isServer, pathname, query, state}) {
      const action = fetcFromServer({id:query.id,filter:'program-detail'});
      const type = {
        programType: 'program-detail',
      };

      return action.payload
      .then(res => {
        return {server: {[type.programType]:res.data}};
      })
      .catch((err) => {
        console.log(err);
        return {server: false};
      });
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
      title: 'title-program',
      statusProgram: false,
    };
    this.type = 'program-detail';
    this.typeEpisode = 'program-episode';
    this.programId = props.router.query.id;
    this.ref = React.createRef();
    this.refPanelEpisode = React.createRef();
    this.refPanelExtra = React.createRef();
    this.refPanelClip = React.createRef();
    this.refPanelPhoto = React.createRef();
  }
  componentDidMount() {
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
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        if (this.props.router.query.content_type === 'extra') {
          this.setState({toggle: 'Extra'});
          this.props.dispatch(fetchExtra(this.programId, 'program-extra'));
          return false;
        }
        if (this.props.router.query.content_type === 'clip') {
          this.setState({toggle: 'Clips'});
          this.props.dispatch(fetchClip(this.programId, 'program-clip'));
          return false;
        }
        this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      }
    }
  }
  shouldComponentUpdate() {
    return true;
  }
  UNSAFE_componentWillMount() {
  }
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
            this.loadFirstTab(this.props.router.query.id)
        }
      );
      if (prevProps.router.query.id !== this.props.router.query.id) {
        this.props.dispatch(setClearClip('program-clip'));
        this.props.dispatch(setClearExtra('program-extra'));
        if (this.props.router.query.content_type === 'extra') {
          this.setState({episodeClearStore: true});
        }
      }
      if (this.props.server && this.props.server[this.type].data) {
        if (this.isTabs(this.props.server[this.type].data).length > 0) {
          if (this.props.router.query.content_type === 'extra') {
            this.setState({toggle: 'Extra'});
            return false;
          }
          if (this.props.router.query.content_type === 'clip') {
            this.setState({toggle: 'Clips'});
            return false;
          }
          this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
        }
      }
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
          <Link
            href={`/programs?id=${mainData.id}&title=${urlRegex(mainData.title)}&content_type=episode&content_id=${detailData.id}&content_title=${urlRegex(detailData.title)}`}
            as={`/programs/${mainData.id}/${urlRegex(mainData.title)}/episode/${detailData.id}/${urlRegex(detailData.title)}`}
            shallow>
            <a onClick={ () => { this.props.dispatch(fetchPlayerUrl(detailData.id,'data-player','episode')); } }>
              <ButtonOutline icon={<PlayArrowIcon/>} text="Play" />
            </a>
          </Link>
          { mainData.trailer_url ? (
            <Link
              href={`/programs?id=${mainData.id}&title=${urlRegex(mainData.title)}`}
              as={`/programs/${mainData.id}/${urlRegex(mainData.title)}`}
              shallow
            >
            <a onClick={ () => { this.props.dispatch(fetchPlayerUrl(mainData.id,'data-player','episode', true)); } }>
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
    if (data.episode > 0 && this.props && this.props.server['program-detail'] && this.props.server['program-detail'].data.category === 'series') {tabs.push('Episodes');}
    if (data.extra > 0) {tabs.push('Extra');}
    if (data.clip > 0) {tabs.push('Clips');}
    // if (data.photo > 0) {tabs.push('Photo');}
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
              <div className="tab-slider" role="presentation"/>
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
    if (tab === 'Episodes') {convert = 'episodes';}
    if (tab === 'Extra') {convert = 'extras';}
    if (tab === 'Clips') {convert = 'clips';}
    if (tab === 'Photo') {convert = 'photos';}
    if (!content_id) {
      href = `/programs?id=${id}&title=${urlRegex(title)}&tab=${convert}`;
      as = `/programs/${id}/${urlRegex(title)}/${convert}`;
    }
    if (content_id) {
      href = `/programs?id=${id}&title=${urlRegex(title)}&content_type=${content_type}&content_id=${content_id}&content_title=${urlRegex(content_title)}&tab=${tab}`;
      as = `/programs/${id}/${urlRegex(title)}/${content_type}/${content_id}/${urlRegex(content_title)}?${convert}`;
    }
    if (!this.props.data['program-extra'] && convert === 'extras') {
      this.props.dispatch(fetchExtra(id, 'program-extra'));
    }
    if (!this.props.data['program-clip'] && convert === 'clips') {
      this.props.dispatch(fetchClip(id, 'program-clip'));
    }
    if (!this.props.data['program-photo'] && convert === 'photos') {
      this.props.dispatch(fetchPhoto(id, 'program-photo'));
    }
    Router.push(href, as, { shallow: true });
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
              onShowMore={() => { this.props.dispatch(fetchEpisode(this.props.router.query.id, 'program-episode',props.data[0].season, pagination.nextPage)); }}
              onSeason={() => {this.props.dispatch(fetchSeasonEpisode(this.props.router.query.id,'program-episode',1, pagination.nextPage));}}
              onBookmarkAdd={this.addBookmark.bind(this)}
              onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
              bookmark={bookmark}
              isLogin={this.statusLogin(this.props.data && this.props.data.bookmark)}
              onShare={(title) => this.toggleActionSheet.bind(this, 'episode', title)}
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
        isLogin={this.statusLogin(this.props.data && this.props.data.bookmark)}
        onShare={(title) => this.toggleActionSheet.bind(this, 'extra', title)}
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
        isLogin={this.statusLogin(this.props.data && this.props.data.bookmark)}
        onShare={(title) => this.toggleActionSheet.bind(this, 'extra', title)}
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
    if (!this.props.data.loading_photo ||
      ((props && props.data && props.data.length > 0) &&
      this.props.server['program-detail'].data.id === this.props.router.query.id)) {
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
      />
        );
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
        />
      );
    }
  }
  switchPanel() {
    if (this.props.router.query.content_id) {
      if(this.props.data && this.props.data['data-player'] && this.props.data['data-player'].data ) {
        const data = this.props.data && this.props.data['data-player'];
        return (
          <div className="program-detail-player-wrapper animated fadeInDown go">
              <Player data={ data.data } isFullscreen={ data.isFullscreen } ref={this.ref}/>
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
  toggleActionSheet(value, title = 'title-program') {
    const { props, state } = this
    this.setState({
      action_sheet: !this.state.action_sheet,
    });
    if(value === 'program') {
      this.setState({title: props.data && props.data['tracking-program'] && props.data['tracking-program'].data && props.data['tracking-program'].data.title, statusProgram: true});
    }
    if(value === 'episode') {
      this.setState({title: title, statusProgram: false});
    }
    if(value === 'extra') {
      this.setState({title: title, statusProgram: false});
    }
    if(value === 'clip') {
      this.setState({title: title, statusProgram: false});
    }

    return 'title-program'
  }
  toggleRateModal(test = '') {
    this.setState({ rate_modal: !this.state.rate_modal });
  }
  statusLogin(data) {
    let isLogin = false
    if(data && data.status) {
      isLogin = data.status.code === 13 ? false : true;
      return isLogin;
    }
  }
  render() {
    const { props, state } = this
    return (
      <Layout>
        {/* <HeadMeta data={props.data && props.data['tracking-program'] } 
                  router={props.router} 
                  dataPlayer={props.data && props.data['description-player']}/> */}
        <div className="program-detail-container animated fadeInDown go">
          { this.switchPanel() }
          <div className="action__button--wrapper">
            <ActionMenu
              onRate={this.toggleRateModal.bind(this)} 
              bookmark={props.data && props.data.bookmark}
              like={props.data && props.data.like}
              onLike={(status, filter, type) => this.props.dispatch(postLike(props.router.query.id,type,filter,status))}
              isLogin={this.statusLogin(props.data && props.data.bookmark)}
              data={ props.server && props.server['program-detail'] && props.server['program-detail'].data }
              onBookmarkAdd={(id, type) => { this.props.dispatch(postBookmark(id,type, 'bookmark')); }}
              onBookmarkDelete={(id, type) => { this.props.dispatch(deleteBookmark(id,type, 'bookmark')); }}
              />
            <ButtonPrimary className="button-20" icon={ <ShareIcon/> } text="Share" onclick={this.toggleActionSheet.bind(this, 'program')}/>
            { this.props.router.query.content_id ? (
              <>
                <ButtonPrimary className="button-20" icon={ <GetApp/> } text="Download" onclick={() => alertDownload()} />
                <ButtonPrimary className="button-20"
                onclick={()=> this.setState({transform: this.state.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)', isOpen: this.state.transform === 'rotate(0deg)' ? true : false})}
                icon={ <KeyboardArrowDown className="arrow-rotate" style={{ transform: this.state.transform }}/> }
                text="Description"
                />
              </>) : '' }
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
            { this.state.action_sheet ? (
              <ActionSheet
              toggle={this.toggleActionSheet.bind(this)}
              tabStatus={state.statusProgram ? 'program' : 
                        props.router.query.tab ? props.router.query.tab :
                        props.router.query.content_type ? props.router.query.content_type :
                        props.router.pathname
                        }
              caption={state.title}
              url={props.router.asPath}
              open={state.action_sheet}
              hashtags={props.data && props.data['tracking-program'] && props.data['tracking-program'].data && props.data['tracking-program'].data.tag}
               />
            ) : ''
            }
            <RatedModal
              open={this.state.rate_modal}
              toggle={this.toggleRateModal.bind(this)}
              isLogin={this.statusLogin(props.data && props.data.like)}
              like={props.data && props.data.like}
              onLike={(status, filter, type) => this.props.dispatch(postLike(props.router.query.id,type,filter,status))}
             />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const { Program } = state;
  return { data: Program };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Index));
