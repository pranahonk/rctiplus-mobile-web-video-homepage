import React, { Component, Children } from 'react';

/*
 *load reactstrap
 *start here
 */
import { Badge } from 'reactstrap';
/*
 *load reactstrap
 *end here
 */
class FooterNav extends Component {
  render() {
    return (
      <div className="nav-footer">
        <div className="footer-wrapper-list">
          <a href="/">
            <img className="nav-footer-icon" src="/static/btn/home/nav.png" />
          </a>
        </div>

        <div className="footer-wrapper-list">
          <a href="/exclusive">
            <img
              className="nav-footer-icon"
              src="/static/btn/exclusive/nav.png"
            />
          </a>
        </div>

        <div className="footer-wrapper-list">
          <a href="/live-tv">
            <img
              className="nav-footer-icon"
              src="/static/btn/live-tv/nav.png"
            />
          </a>
        </div>

        <div className="footer-wrapper-list">
          <a href="/trending">
            <img
              className="nav-footer-icon"
              src="/static/btn/trending/nav.png"
            />
          </a>
        </div>

        <div className="footer-wrapper-list">
          <a href="/more">
            <img className="nav-footer-icon" src="/static/btn/more/nav.png" />
          </a>
        </div>
      </div>
    );
  }
}
export default FooterNav;
