import React from 'react';
import Head from 'next/head';
import Nav from '../components/Nav/NavDefault';
import Layout from '../components/Templates/Layout';
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

class Home extends React.Component {
  render() {
    return (
      <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
        <Nav />
        <Carousel />
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
        <p>text</p>
      </Layout>
    );
  }
}

export default Home;
