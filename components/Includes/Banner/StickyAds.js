import React, { Component } from 'react';
import Router from 'next/router';

//load reactstrap
import { Navbar, NavbarBrand } from 'reactstrap';

//load home page scss
import '../../../assets/scss/components/sticky_ads.scss';


class StickyAds extends Component {
    render() {
        return (
                <div className="sticky-ads">
                    <div className="sticky-ads-content">
                        <div id='div-gpt-ad-1575288448615-0' style='width: 100%; height: 90px;'>
                            <script>
                              googletag.cmd.push(function() { 
                                googletag.display('div-gpt-ad-1575288448615-0')
                              });
                            </script>
                        </div>
                    </div>
                </div>
                );
    }
}
export default StickyAds;
    