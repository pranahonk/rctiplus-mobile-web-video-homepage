import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavDefault from '../components/Includes/Navbar/NavDefault';

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  Label,
  Input,
  FormText,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from 'reactstrap';

//load home page scss
import '../assets/scss/components/homepage.scss';

class Exclusive extends React.Component {
  static getInitialProps(ctx) {
    initialize(ctx);
  }

  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      meta: null,
    };
  }

  componentDidMount() {
    this.props.getContents(1).then(response => {
      this.setState({
        contents: this.props.contents.homepage_content,
        meta: this.props.contents.meta,
      });
    });
  }

  render() {
    const contents = this.state.contents;
    const meta = this.state.meta;

    return (
      <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
        <div>
          <NavDefault />
          <div class="wrapper-content">
            <div className="nav-exclusive-wrapper">
              <Nav tabs id="exclusive">
                <NavItem className="exclusive-item">
                  <NavLink active>All</NavLink>
                </NavItem>
                <NavItem className="exclusive-item">
                  <NavLink>Clip</NavLink>
                </NavItem>
                <NavItem className="exclusive-item">
                  <NavLink>Photo</NavLink>
                </NavItem>
                <NavItem className="exclusive-item">
                  <NavLink>Entertainment</NavLink>
                </NavItem>
                <NavItem className="exclusive-item">
                  <NavLink>News</NavLink>
                </NavItem>
                <NavItem className="exclusive-item">
                  <NavLink>Bloopers</NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab="1">
                <TabPane tabId="1">
                  <div className="content-tab-exclusive">tab all</div>
                </TabPane>
                <TabPane tabId="2">
                  <div className="content-tab-exclusive">tab Clip</div>
                </TabPane>
                <TabPane tabId="3">
                  <div className="content-tab-exclusive">tab Photo</div>
                </TabPane>
                <TabPane tabId="4">
                  <div className="content-tab-exclusive">tab Entertainment</div>
                </TabPane>
                <TabPane tabId="5">
                  <div className="content-tab-exclusive">tab News</div>
                </TabPane>
                <TabPane tabId="6">
                  <div className="content-tab-exclusive">tab Bloopers</div>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(state => state, contentActions)(Exclusive);
