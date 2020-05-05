import React from 'react';
import '../../../assets/scss/components/toast.scss';
import Close from '@material-ui/icons/Close';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Countdown from 'react-countdown-now';
import { getCountdown } from '../../../utils/helpers';

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isclose: false,
      timeCount: props.data !== null ? getCountdown(props.data.end_date, props.data.current_date)[0] : 10000,
      isStatus:props.data !== null ? getCountdown(props.data.end_date, props.data.current_date)[1] : false,
    };
  }

  completed() {
    console.log('this countdown complete');
    this.props.count(true)
  }
  isRender({days, hours, minutes, seconds}) { 
    return (<div/>);
  }
  render() {
    const { data } = this.props;
    return (
      <div>
          {
            this.state.isclose || !this.state.isStatus ? (<div/>) :
            (
              <div>
              <Countdown date={Date.now() + this.state.timeCount} onComplete={this.completed.bind(this)} renderer={this.isRender}/>
              <div className="toast-wrapper">
                <div className="toast-border" />
                <ChevronRight fontSize="small" className="chevron-right"/>
                <div className="toast-close" onClick={() => this.setState({isclose: true})}>
                  <Close fontSize="small"/>
                </div>
                <div className="toast-content">
                  <span className="toast-content__time">{ data.time_diff }</span>
                  <h1 className="toast-content__title">{ data.sponsor_name }</h1>
                  <p className="toast-content__description" onClick={() => window.open(data.webview_url,'_blank')}>{ data.description }</p>
                </div>
              </div>
              </div>)
             }
      </div>
    );
  }
}

export default Toast;
