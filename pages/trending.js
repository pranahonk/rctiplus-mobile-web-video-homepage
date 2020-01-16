import React from 'react';

//load default layout
import Layout from '../components/Layouts/Default';

//load navbar default
import NavDefault from '../components/Includes/Navbar/NavDefault';

//load SubCategory trending
import SubCategory from '../components/Includes/Trending/SubCategory';

//load home page scss
import '../assets/scss/components/homepage.scss';

export default class Trending extends React.Component {
    render() {
        return (
                <Layout title="RCTI+ - Live Streaming Program 4 TV Terpopuler">
                    <div>
                        <NavDefault />
                        <div className="wrapper-content">
                            <SubCategory/>
                        </div>
                    </div>
                </Layout>
                )
    }
}
