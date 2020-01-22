import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
//load default layout
import Layout from '../../components/Layouts/Default';

//load navbar default
import NavBack from '../../components/Includes/Navbar/NavTrendingSearch';

//load style 
import '../../assets/scss/components/trending_search.scss';

class Search extends React.Component {
    render() {
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <NavBack />
                    <div className="content-trending-search">
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
                    </div>
                </Layout>
                );
    }
}

export default Search;
