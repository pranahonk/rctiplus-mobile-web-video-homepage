import React from 'react';
import '../../../assets/scss/components/toast.scss';
import Close from '@material-ui/icons/Close';

class Toast extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <div className="toast-wrapper">
          <div className="toast-border" />
          <div className="toast-close">
            <Close fontSize="small"/>
          </div>
          <div className="toast-content">
            <span className="toast-content__time">3s ago</span>
            <h1 className="toast-content__title">RCTIPLUS</h1>
            <p className="toast-content__description">nikmati promo menarik untuk kamu nikmati promo menarik untuk 
              kamu nikmati promo menarik untuk kamu nikmati promo menarik untuk kamu nikmati promo menarik untuk kamu
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default Toast;
