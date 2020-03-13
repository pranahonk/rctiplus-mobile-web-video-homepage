import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import classnames from 'classnames';

import Layout from '../components/Layouts/Default';
import NavTrending from '../components/Includes/Navbar/NavTrending';
import HeadlineCarousel from '../components/Includes/Gallery/HeadlineCarousel';

import TabLoader from '../components/Includes/Shimmer/TabLoader';
import HeadlineLoader from '../components/Includes/Shimmer/HeadlineLoader';
import ArticleLoader from '../components/Includes/Shimmer/ArticleLoader';

import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';

import { SITEMAP } from '../config';

import '../assets/scss/components/trending_v2.scss';

import newsv2Actions from '../redux/actions/newsv2Actions';

class Trending_v2 extends React.Component {

    state = {
        active_tab: 'Berita Utama'
    };

    constructor(props) {
        super(props);
        this.tabs = ['Berita Utama', 'Terkini', 'Populer'];
    }

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    componentDidMount() {
        this.props.getNews()
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getMetadata() {
        if (Object.keys(this.props.query).length > 0) {
            const name = this.props.query.subcategory_title.toLowerCase().replace(/-/g, '_');
            if (SITEMAP[`trending_${name}`]) {
                return SITEMAP[`trending_${name}`];
            }
        }

        return SITEMAP['trending'];
    }

    toggleTab(tab) {
        if (this.state.active_tab != tab) {
            this.setState({ active_tab: tab });
        }
    }

    render() {
        const metadata = this.getMetadata();
        return (
            <Layout title={metadata.title}>
                <Head>
                    <meta name="description" content={metadata.description} />
                    <meta name="keywords" content={metadata.keywords} />
                    {/* <!-- Trending site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145455301-9"></script>
                    <script dangerouslySetInnerHTML={{ __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-145455301-9');
                    ` }}></script>
                </Head>
                <NavTrending disableScrollListener />
                <div className="main-content">
                    {/* <div className="navigation-container">
                        <Nav tabs className="navigation-tabs">
                            {this.tabs.map((tab, i) => (
                                <NavItem
                                    key={`${i}-${tab}`}
                                    className={classnames({
                                        active: this.state.active_tab === tab,
                                        'navigation-tabs-item': true
                                    })}
                                    onClick={() => this.toggleTab(tab)}>
                                    <NavLink className="item-link">{tab}</NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <div className="add-tab-button">
                            <AddIcon/>
                        </div>
                    </div> */}

                    <div>
                        <TabLoader/>
                    </div>
                    <div>
                        <HeadlineLoader/>
                        <ArticleLoader/>
                        <ArticleLoader/>
                    </div>
                    {/* <TabContent activeTab={this.state.active_tab}>
                        {this.tabs.map((tab, i) => (
                            <TabPane key={i} tabId={tab}>
                                <HeadlineCarousel/>
                                <ListGroup className="article-list">
                                    <ListGroupItem className="article">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p>inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="article article-no-border">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p className="source">inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="article article-full-width article-no-border">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p className="source">inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="article">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p className="source">inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="article">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p className="source">inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="article article-no-border">
                                        <div className="article-description">
                                            <div className="article-thumbnail-container">
                                                <img className="article-thumbnail" src={`https://cdn.zeplin.io/5e3f7199c016cd0dd859b29a/assets/6A93FFFD-6A92-4EA7-BFE3-78C9FCF278C2.png`}/>
                                            </div>
                                            <div className="article-title-container">
                                                <h4 className="article-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h4>
                                            </div>
                                        </div>
                                        <div className="article-source">
                                            <p className="source">inews.id&nbsp;&nbsp;</p>
                                            <p>Senin, 2 Februari 2020 - 18.03</p>
                                        </div>
                                    </ListGroupItem>
                                </ListGroup>
                            </TabPane>
                        ))}
                    </TabContent> */}
                </div>
            </Layout>
        );
    }

}

export default connect(state => state, newsv2Actions)(Trending_v2);