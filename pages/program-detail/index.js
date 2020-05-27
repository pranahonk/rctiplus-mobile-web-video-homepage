import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from "next/link";
import Router, { withRouter } from 'next/router';
import classnames from 'classnames';
import Img from 'react-image';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayListAdd from '@material-ui/icons/PlayListAdd';
import GetApp from '@material-ui/icons/GetApp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { fetchDetailProgram } from '../../redux/actions/program-detail/programDetail';
import Layout from '../../components/Layouts/Default_v2';
import { Button, Col, Nav, NavItem, NavLink, TabContent, TabPane, Collapse } from 'reactstrap';
import '../../assets/scss/components/program-detail.scss';
import { BASE_URL, DEV_API, VISITOR_TOKEN, SITE_NAME, SITEMAP, GRAPH_SITEMAP, REDIRECT_WEB_DESKTOP, RESOLUTION_IMG } from '../../config';
import { fetcFromServer } from '../../redux/actions/program-detail/programDetail';
const Player = dynamic(() => import('../../components/Includes/Player/Player').then((mod) => mod.Player));
const MainLoader = dynamic(() => import('../../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.MainLoader));
const TabListLoader = dynamic(() => import('../../components/Includes/Shimmer/detailProgramLoader').then((mod) => mod.TabListLoader));
const ButtonOutline = dynamic(() => import('../../components/Includes/Common/Button').then((mod) => mod.ButtonOutline));
const ButtonPrimary = dynamic(() => import('../../components/Includes/Common/Button').then((mod) => mod.ButtonPrimary));
const ThumbUpIcon = dynamic(() => import('../../components/Includes/Icons/Actions').then((mod) => mod.ThumbUpIcon));
const ShareIcon = dynamic(() => import('../../components/Includes/Icons/Actions').then((mod) => mod.ShareIcon));

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
    };
    this.type = 'program-detail';
    this.id = props.router.query.id;
  }
  componentDidMount() {
    console.log(this.props);
      if (this.isTabs(this.props.server[this.type].data).length > 0) {
        this.setState({toggle: this.isTabs(this.props.server[this.type].data)[0]});
      }
  }
  shouldComponentUpdate() {
    console.log('COMPONENT UPDATE')
    return true
  }
  UNSAFE_componentWillMount() {
    console.log(this.props);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('NEXT PROPS:',nextProps);
  }
  componentDidUpdate() {
    console.log('DID UPDATE: ', this.props.router.query)
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
              <h2>Drama - Komedi - Keluarga</h2>
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
  isTabs(data) {
    const tabs = [];
    if (data.episode > 0) {tabs.push('Episodes');}
    if (data.extra > 0) {tabs.push('Extra');}
    if (data.clip > 0) {tabs.push('Clips');}
    if (data.photo > 0) {tabs.push('Photo');}

    return tabs;
  }
  tabContent() {
    const { data, meta } = this.props.server[this.type];
    console.log('DATA EPISODE: ',data.episode > 0);
    console.log('DATA EXTRA: ',data.extra > 0);
    console.log('DATA CLIP',data.clip > 0);
    console.log('DATA PHOTO: ',data.photo > 0);
    this.isTabs(data);
    if (data && this.isTabs(data).length > 0) {
      return (
        <Nav tabs className="flex-nav">
          {
            this.isTabs(data).map((tab, i) => {
              return (
                <NavItem key={i} className={classnames({active: this.state.toggle === tab, [tab]: true})}>
                  <NavLink
                  onClick={() => this.setState({ toggle: tab })}>
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
  navigate(e) {
    e.preventDefault();
    const href = `/programs?id=532&title=sdfdsfds`
    const as = `/programs/532/cobadulu`
    Router.replace(href, as, { shallow: true })
  }
  render() {
    return (
      <Layout>
        <div className="program-detail-container">
          {/* <div className="program-detail-player-wrapper">
              <Player />
          </div> */}
          <Link href="/programs/index?id=532&title=sdfdsfds" as="/programs/532/cobadulu/episode" shallow>
            <NavLink>CLICK</NavLink>
          </Link>
          <button onClick={ () => Router.push('/programs/index?id=532&title=sdfdsfds&content_type=episode', '/programs/532/cobadulu/episode', { shallow: true }) }>TEST</button>
          { this.mainContent() }
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
            <div className="list__content-wrapper">
              <div className="tab__content-wrapper">
                { this.tabContent() }
                <TabContent activeTab={this.state.toggle}>
                  <TabPane tabId="Episodes">
                    <div className="episode-program">
                      <div className="season__program">
                          Season
                      </div>
                      <div className="panel-content">
                        <div className="thumb-img__content">
                          <img src="https://static.rctiplus.id/media/500/files/fta_rcti/Landscape/clips_syair_ramadhan/clps_sr_02.jpg" alt="title"/>
                        </div>
                        <div className="thumb-detail__content">
                          <h3>Kerinduan Maya Yang Luar Biasa Pada Abahnya</h3>
                          <div className="action-button__content ">
                            <ButtonPrimary icon={ <PlayListAdd/> }/>
                            <ButtonPrimary icon={ <ShareIcon/> }/>
                            <ButtonPrimary icon={ <GetApp/> }/>
                          </div>
                        </div>
                      </div>
                      <div className="summary__content">
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        </p>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tabId="Extra">
                    sdfjhskjghd
                  </TabPane>
                  <TabPane tabId="Clips">
                    sdfjhskjghdjkghdfjkghd
                  </TabPane>
                  <TabPane tabId="Photo">
                    sdfj
                  </TabPane>
                </TabContent>
              </div>
            </div>
            <div className="related__program-wrapper">
              <h4>Related Program</h4>
              <div className="related__program-list">
                <div className="related-item">
                  <img src="https://static.rctiplus.id/media/500/files/fta_rcti/Portrait/rsi_potrait_768_x_1152.jpg" alt="title"/>
                </div>
                <div className="related-item">
                  <img src="https://static.rctiplus.id/media/500/files/fta_rcti/Portrait/rsi_potrait_768_x_1152.jpg" alt="title"/>
                </div>
                <div className="related-item">
                  <img src="https://static.rctiplus.id/media/500/files/fta_rcti/Portrait/rsi_potrait_768_x_1152.jpg" alt="title"/>
                </div>
                <div className="related-item">
                  <img src="https://static.rctiplus.id/media/500/files/fta_rcti/Portrait/rsi_potrait_768_x_1152.jpg" alt="title"/>
                </div>
              </div>
            </div>
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
