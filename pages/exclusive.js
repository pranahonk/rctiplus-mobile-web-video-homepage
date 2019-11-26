import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Lazyload from 'react-lazyload';
import contentActions from '../redux/actions/contentActions';
import initialize from '../utils/initialize';
import NavDefault from '../components/Nav/NavDefault';
import Layout from '../components/Templates/Layout';
import Stories from '../components/Stories';
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
/*
 *load carousel
 *start here
 */
import Carousel from '../components/Gallery/Carousel';
import '../assets/scss/carousel.scss';
/*
 *load carousel
 *end here
 */

// https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2

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
              <Nav tabs>
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
