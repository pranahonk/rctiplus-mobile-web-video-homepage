import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import Img from 'react-image';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayListAdd from '@material-ui/icons/PlayListAdd';
import GetApp from '@material-ui/icons/GetApp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import {
  fetchDetailProgram,
  fetchEpisode,
  fetchSeasonEpisode,
  seasonSelected,
  fetchRelatedProgram,
  fetchExtra,
  fetchClip,
  fetchPhoto,
  setClearClip,
  setClearExtra,
  fetchEpisodeUrl,
  clearPlayer,
} from '../redux/actions/program-detail/programDetail';
import Layout from '../components/Layouts/Default_v2';
import { Button, Col, Nav, NavItem, NavLink, TabContent, TabPane, Collapse } from 'reactstrap';
import '../assets/scss/components/program-detail.scss';
import { BASE_URL, DEV_API, VISITOR_TOKEN, SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../config';
import { fetcFromServer } from '../redux/actions/program-detail/programDetail';
const Player = dynamic(() => import('../components/Includes/Player/Player'));
const MainLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.MainLoader));
const TabListLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.TabListLoader));
const TabPanelLoader = dynamic(() => import('../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.TabPanelLoader));
const ButtonOutline = dynamic(() => import('../components/Includes/Common/Button').then((mod) => mod.ButtonOutline));
const ButtonPrimary = dynamic(() => import('../components/Includes/Common/Button').then((mod) => mod.ButtonPrimary));
const ThumbUpIcon = dynamic(() => import('../components/Includes/Icons/Actions').then((mod) => mod.ThumbUpIcon));
const ShareIcon = dynamic(() => import('../components/Includes/Icons/Actions').then((mod) => mod.ShareIcon));
const PanelEpisode = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelEpisode));
const PanelExtra = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelExtra));
const PanelClip = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelClip));
const PanelPhoto = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelPhoto));
const PanelRelated = dynamic(() => import('../components/Includes/program-detail/programDetail').then((mod) => mod.PanelRelated));

class Index extends React.Component {
  static getInitialProps({store, isServer, pathname, query, state}) {
      // lets create an action using creator
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
      // once the payload is available we can resume and render the app
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
      statusTab: true,
    };
    this.type = 'program-detail';
    this.programId = props.router.query.id;
    this.ref = React.createRef();
  }
  componentDidMount() {
    console.log('MOUNTED: ', this.props.data['program-episode']);
    this.setState({episodeClearStore: true}, () => this.loadFirstTab(this.programId));
    this.loadRelated(this.programId,1);
    if (this.props.server && this.props.server[this.type].data) {
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      }
    }
    if (this.props.router.query.content_id) {
      this.props.dispatch(fetchEpisodeUrl(this.props.router.query.content_id,'episode-url',1));
    }
  }
  shouldComponentUpdate() {
    console.log('COMPONENT UPDATE');
    return true;
  }
  UNSAFE_componentWillMount() {
    console.log(this.props);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('NEXT PROPS:',nextProps);
  }
  componentDidUpdate(prevProps) {
    console.log('PREV PROPS: ', prevProps.router.query);
    console.log('DID UPDATE: ', this.props.router.query);
    if (prevProps.router.query.id !== this.props.router.query.id) {
      console.log('TRUE');
      this.loadRelated(this.props.router.query.id,1);
      this.setState({episodeClearStore: true, clipClearStore: true}, () => this.loadFirstTab(this.props.router.query.id));
      this.props.dispatch(setClearClip('program-clip'));
      this.props.dispatch(setClearExtra('program-extra'));
      if (this.props.server && this.props.server[this.type].data) {
        if (this.isTabs(this.props.server[this.type].data).length > 0) {
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
              <ButtonOutline icon={<PlayArrowIcon/>} text="Play" />
              <ButtonOutline text="Trailer" />
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
    if (this.props.server && this.props.server[this.type].data) {
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
            if (!this.props.data['program-clip']) {
              this.props.dispatch(fetchPhoto(programId, 'program-photo'));
            }
            break;
          default:
            this.setState({statusTab: false});
            return;
        }
      }
    }
  }
  isTabs(data) {
    const tabs = [];
    if (data.episode > 1) {tabs.push('Episodes');}
    if (data.extra > 0) {tabs.push('Extra');}
    if (data.clip > 0) {tabs.push('Clips');}
    if (data.photo > 0) {tabs.push('Photo');}

    return tabs;
  }
  tabContent() {
    if (this.props.server && this.props.server[this.type].data) {
      const { data, meta } = this.props.server[this.type];
      this.isTabs(data);
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
      return (<TabListLoader/>);
    }
    return (<TabListLoader/>);
  }
  redirect(tab) {
    let convert = '';
    if (tab === 'Episodes') {convert = 'episodes';}
    if (tab === 'Extra') {convert = 'extras';}
    if (tab === 'Clips') {convert = 'clips';}
    if (tab === 'Photo') {convert = 'photos';}
    const path = this.props && this.props.server && this.props.server[this.type];
    const href = `/programs?id=${path.data.id}&title=${path.data.title}&tab=${convert}`;
    const as = `/programs/${path.data.id}/${path.data.title}/${convert}`;
    if (!this.props.data['program-extra'] && convert === 'extras') {
      this.props.dispatch(fetchExtra(path.data.id, 'program-extra'));
    }
    if (!this.props.data['program-clip'] && convert === 'clips') {
      this.props.dispatch(fetchClip(path.data.id, 'program-clip'));
    }
    if (!this.props.data['program-photo'] && convert === 'photos') {
      this.props.dispatch(fetchPhoto(path.data.id, 'program-photo'));
    }
    Router.push(href, as, { shallow: true });
  }
  hasMore(props, page) {
    this.loadRelated(this.props.router.query.id, page);
  }
  getLinkVideo(id, filter, season) {
    const vm = this;
    vm.props.dispatch(fetchEpisodeUrl(id,filter,season));
  }
  panelEpisode(props) {
    if (!this.props.data.loading_episode ||
        ((props && props.data && props.data.length > 0) &&
        this.props.server['program-detail'].data.id === this.props.router.query.id)) {
        const pagination = {
          page: props.meta.pagination.current_page,
          total_page: props.meta.pagination.total_page,
          nextPage: props.meta.pagination.current_page + 1,
        };
        const query = {
          id: this.props.router.query.id,
          title: this.props.server && this.props.server[this.type].data && this.props.server[this.type].data.title,
        };
        return (
          <>
            <PanelEpisode
              enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
              data={props}
              query={query}
              link={this.getLinkVideo.bind(this)}
              seasonSelected= { this.props.data.seasonSelected }
              onShowMore={() => { this.props.dispatch(fetchEpisode(this.props.router.query.id, 'program-episode',props.data[0].season, pagination.nextPage)); }}
              onSeason={() => {this.props.dispatch(fetchSeasonEpisode(this.props.router.query.id,'program-episode',1, pagination.nextPage));}}
            />
          </>
          );
      }

    return (
      <TabPane tabId="Episodes">
        <TabPanelLoader />
      </TabPane>
    );
  }
  panelExtra(props) {
    if (!this.props.data.loading_extra ||
        ((props && props.data && props.data.length > 0) &&
        this.props.server['program-detail'].data.id === this.props.router.query.id)) {
      const pagination = {
        page: props.meta.pagination.current_page,
        total_page: props.meta.pagination.total_page,
        nextPage: props.meta.pagination.current_page + 1,
      };
      return (
      <PanelExtra
        enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
        onShowMore={() => { this.props.dispatch(fetchEpisode(this.props.router.query.id, 'program-extra',pagination.nextPage)); }}
        data={props}
      />
        );
    }
    return (
      <TabPane tabId="Extra">
        <TabPanelLoader />
      </TabPane>
    );
  }
  panelClip(props) {
    if (!this.props.data.loading_clip ||
        ((props && props.data && props.data.length > 0) &&
        this.props.server['program-detail'].data.id === this.props.router.query.id)) {
      const pagination = {
        page: props.meta.pagination.current_page,
        total_page: props.meta.pagination.total_page,
        nextPage: props.meta.pagination.current_page + 1,
      };
      return (
      <PanelClip
        enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
        onShowMore={() => { this.props.dispatch(fetchClip(this.props.router.query.id, 'program-clip',pagination.nextPage)); }}
        data={props}
      />
        );
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
        enableShowMore={{isNext:pagination.page < pagination.total_page, isLoading:this.props.data.loading_more}}
        onShowMore={() => { this.props.dispatch(fetchClip(this.props.router.query.id, 'program-clip',pagination.nextPage)); }}
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
      console.log('SHOWMORE TRUE', pagination.nextPage);
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
    if (this.props.data && this.props.data['episode-url'] && this.props.data['episode-url'].data) {
      console.log('RERENDER PLAYERRRRR');
      const data = this.props.data && this.props.data['episode-url'] && this.props.data['episode-url'].data;
      return (
        <div className="program-detail-player-wrapper">
            <Player data={ data } ref={this.ref}/>
        </div>
      );
    }
    return (
      this.mainContent()
    );
  }
  render() {
    return (
      <Layout>
        <div className="program-detail-container">
          { this.switchPanel() }
          <div className="action__button--wrapper">
            <ButtonPrimary icon={ <ThumbUpIcon/> } text="Rated" />
            <ButtonPrimary icon={ <ShareIcon/> } text="Share" />
            <ButtonPrimary icon={ <GetApp/> } text="Download" />
            <ButtonPrimary
              onclick={()=> this.setState({transform: this.state.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)', isOpen: this.state.transform === 'rotate(0deg)' ? true : false})}
              icon={ <KeyboardArrowDown className="arrow-rotate" style={{ transform: this.state.transform }}/> }
              text="Description" />
            </div>
            <Collapse isOpen={this.state.isOpen}>
              <div className="detail__content-description-wrapper">
                <div className="content-description">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </Collapse>
            { this.state.statusTab ?
            (<div className="list__content-wrapper">
              <div className="tab__content-wrapper">
                { this.tabContent() }
                <TabContent activeTab={this.state.toggle}>
                  { this.panelEpisode(
                      this.props.data &&
                      this.props.data['program-episode'] &&
                      this.props.data['program-episode']['season-' + this.props.data.seasonSelected]
                      ) }
                  { this.panelExtra(
                    this.props.data &&
                    this.props.data['program-extra']
                  ) }
                  { this.panelClip(
                    this.props.data &&
                    this.props.data['program-clip']
                  ) }
                  { this.panelPhoto(
                    this.props.data &&
                    this.props.data['program-photo']
                  ) }
                </TabContent>
              </div>
            </div>) : '' }
                  {this.panelRelated(
                    this.props.data &&
                    this.props.data['program-related']
                  )}
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
