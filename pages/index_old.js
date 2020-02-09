import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';

import contentActions from '../redux/actions/contentActions';
import pageActions from '../redux/actions/pageActions';

import initialize from '../utils/initialize';

import Layout from '../components/Layouts/Default';
import NavDownloadApp from '../components/Includes/Navbar/NavDownloadApp';
import Nav from '../components/Includes/Navbar/NavDefault';
import Carousel from '../components/Includes/Gallery/Carousel';
import Stories from '../components/Includes/Gallery/Stories';
import Panel1 from '../components/Panels/Pnl_1';
import Panel2 from '../components/Panels/Pnl_2';
import Panel3 from '../components/Panels/Pnl_3';
import Panel4 from '../components/Panels/Pnl_4';
import StickyAds from '../components/Includes/Banner/StickyAds';
import ScheduleTV from '../components/Includes/Schedules/LiveTv';

import { SITEMAP } from '../config';

class Index extends React.Component {
    static async getInitialProps(ctx) {
        initialize(ctx);
    }

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            page: 1,
            fetchAllowed: true,
            meta: null,
            resolution: 593,
            is_loading: false
        };

        this.props.setPageLoader();
    }

    componentDidMount() {
        this.props.getContents(this.state.page, 5)
            .then(response => {
                this.setState({ contents: this.props.contents.homepage_content, meta: this.props.contents.meta }, () => this.props.unsetPageLoader());
            })
            .catch(error => {
                console.log(error);
                this.props.unsetPageLoader();
            });
    }

    bottomScrollFetch() {
        const page = this.state.page + 1;
        if (this.state.fetchAllowed && !this.state.is_loading) {
            this.setState({ is_loading: true }, () => {
                this.LoadingBar.continuousStart();
                this.props.getContents(page, 5)
                    .then(response => {
                        const homepageContents = this.state.contents;
                        if (this.props.contents.homepage_content.length > 0) {
                            homepageContents.push.apply(homepageContents, this.props.contents.homepage_content);
                            this.setState({
                                contents: homepageContents,
                                page: page,
                                fetchAllowed: page != this.state.meta.pagination.total_page,
                                is_loading: false
                            });
                        }
                        else {
                            this.setState({ fetchAllowed: false, is_loading: false });
                        }
                        this.LoadingBar.complete();
                    })
                    .catch(error => {
                        this.LoadingBar.complete();
                        console.log(error);
                        this.setState({ is_loading: false });
                    });
            });
            
        }
    }

    render() {
        const contents = this.state.contents;
        const meta = this.state.meta || {};
        return (
            <Layout title={SITEMAP.home.title}>
                <Head>
                    <meta name="description" content={SITEMAP.home.description} />
                    <meta name="keywords" content={SITEMAP.home.keywords} />
                </Head>
                <BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
                <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
                {/* <NavDownloadApp /> */}
                <Nav />
                <Carousel>
                    <ScheduleTV />
                </Carousel>
                {/* <h3>process.env.is_show_sticky_ads</h3> */}
                <StickyAds />
                <Stories />
                {contents.map(content => {
                    switch (content.display_type) {
                        case 'horizontal_landscape_large':
                            return <Panel1 type={content.type} loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={this.state.resolution} />;

                        case 'horizontal_landscape':
                            return <Panel2 loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={this.state.resolution} />;

                        case 'horizontal':
                            return <Panel3 loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={this.state.resolution} />;

                        case 'vertical':
                            return <Panel4 loadingBar={this.LoadingBar} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={this.state.resolution} />;
                    }
                })}
            </Layout>
        );
    }

}

export default connect(state => state, {
    ...contentActions,
    ...pageActions
})(Index);
