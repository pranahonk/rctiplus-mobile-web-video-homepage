import React from 'react';
import Head from 'next/head';
import { withRouter } from 'next/router';

//load scss style 
import '../../assets/scss/custom.scss';
import '../../assets/scss/global.scss';
import 'sweetalert2/src/sweetalert2.scss';
//import '../../assets/scss/homepage.scss';

import '../../assets/scss/components/alert.scss';

//load redux
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import pageActions from '../../redux/actions/pageActions';

//load footer
import Footer from '../../components/Includes/Footer/Default';
//import Analytics from '../../components/Includes/Google/Analytics';

import { AUTHOR, VIEWPORT, MAIN_DESCRIPTION, OPEN_GRAPH } from '../../config';
import { Spinner } from 'reactstrap';

class Default extends React.Component {

    componentDidMount() {
        console.log('User added to home screen');
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeinstallprompt', async e => {
                // beforeinstallprompt Event fired
                try {
                    // e.userChoice will return a Promise.
                    const choiceResult = await e.userChoice;
                    if (choiceResult.outcome === 'dismissed') {
                        /* eslint-disable no-console */
                        console.log('User cancelled home screen install');
                        /* eslint-enable no-console */
                    } else {
                        /* eslint-disable no-console */
                        /* eslint-enable no-console */
                    }
                } catch (error) {
                    /* eslint-disable no-console */
                    console.error(
                        'user choice prompt promise failed to resolve, error: ',
                        error,
                    );
                    /* eslint-enable no-console */
                }
            });
        }
    }

    render() {
        return (
            <div>
                <Head>
                    <title>{this.props.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#171717"/>
                    <meta name="msapplication-TileColor" content="#171717"/>
                    <meta name="msapplication-navbutton-color" content="#171717"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="#171717"/>

                    <meta name="author" content={AUTHOR} />
                    <meta name="viewport" content={VIEWPORT} />
                    <meta name="description" content={MAIN_DESCRIPTION} />
                    {Object.keys(OPEN_GRAPH).map(og => (<meta key={og} name={'og:' + og} content={OPEN_GRAPH[og]} />))}
                    <link rel="icon" href="/static/logo/rcti.png?v=1.0" />
                    <link rel="manifest" href="/static/manifest.json" />
                    <link rel="canonical" href={`http://www.rctiplus.com${this.props.router.asPath}`}></link>
                    <script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
                    <script src="https://cdn.jwplayer.com/libraries/Vp85L1U1.js"></script>
                    <script src="//dl.conviva.com/mnc-test/jwplayer/stable/conviva.js"></script>
                </Head>
                {this.props.pages.loading ? (<div className={'default-loader ' + (this.props.pages.fade ? 'loader-fade' : '')}>
                    <div className={'loader'}>
                        <Spinner color="danger"/>
                    </div>
                </div>) : <div></div>}
                
                <div style={{ overflowX: 'hidden', marginTop: -5 }} id="wr" className="wrapper has-text-centered">{this.props.children}</div>
                <Footer />
            </div>
        )
    }

}

export default connect(state => state, {
    ...actions,
    ...pageActions
})(withRouter(Default));
