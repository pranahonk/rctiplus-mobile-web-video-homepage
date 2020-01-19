import React from 'react';
import Router from 'next/router';

//load home page scss
import '../../../assets/scss/components/schedule-livetv.scss';

export default class LiveTv extends React.Component {
    render() {
        return (
            <div className="schedule-livetv">
                <h3>i News Live Streaming</h3>
            </div>
        );
    }
}