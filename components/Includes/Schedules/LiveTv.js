import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';

import liveAndChatActions from '../../../redux/actions/liveAndChatActions';
import { formatDate } from '../../../utils/dateHelpers';

//load home page scss
import '../../../assets/scss/components/schedule-livetv.scss';

class LiveTv extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schedules: []
        };
        this.currentDate = new Date();
    }

    isLiveProgram(epg) {
		const currentTime = this.currentDate.getTime();
		const startTime = new Date(formatDate(this.currentDate) + ' ' + epg.s).getTime();
		const endTime = new Date(formatDate(this.currentDate) + ' ' + epg.e).getTime();
		return currentTime > startTime && currentTime < endTime;
	}
    
    componentDidMount() {
        this.props.getLiveEvent('on air')
            .then(response => {
                if (response.status === 200 && response.data.status.code === 0) {
                    let promises = [];
                    let schedules = [];
                    const data = response.data.data;
                    for (let i = 0; i < data.length; i++) {
                        promises.push(this.props.getEPG(formatDate(this.currentDate), data[i].channel_code));
                    }
                    Promise.all(promises).then(results => {
                        for (let i = 0; i < results.length; i++) {
                            let epg = {};
                            if (results[i].status === 200 && results[i].data.status.code === 0) {
                                epg = {
                                    epg: results[i].data.data,
                                    ...data[i]
                                };
                            }
                            schedules.push(epg);
                        }

                        this.setState({ schedules: schedules });
                    });
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="schedule-livetv">
                <Carousel style={{ height: '100%' }} autoPlay axis="vertical" statusFormatter={(current, total) => `${current}/${total}`} showThumbs={false} showIndicators={false} stopOnHover={false} infiniteLoop showStatus={false} swipeable>
                    {this.state.schedules.map((s, i) => (
                        <div className="item" key={i} onClick={() => Router.push(`/tv/${s.channel_code}`)}>
                            <p className="channel">{`${s.name} - Live Streaming`}</p>
                            {s.epg.map((e, j) => {
                                if (this.isLiveProgram(e)) {
                                    let renderedPrograms = [(
                                    <div key={j} className="box current-live">
                                        <p className="title">NOW</p>
                                        <p className="subtitle">{`${e.s} - ${e.e} - ${e.title}`}</p>
                                    </div>)];

                                    if (s.epg[j + 1] != undefined) {
                                        renderedPrograms.push(
                                            <div key={j + 1} className="box">
                                                <p className="title">NEXT</p>
                                                <p className="subtitle">{`${s.epg[j + 1].s} - ${s.epg[j + 1].e} - ${s.epg[j + 1].title}`}</p>
                                            </div>
                                        );
                                    }

                                    return renderedPrograms;
                                }

                                return (<span key={j}></span>);
                            })}
                            
                            
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    }

}

export default connect(state => state, liveAndChatActions)(LiveTv);