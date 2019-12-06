import React from 'react';
import { connect } from 'react-redux';
import notificationActions from '../../../redux/actions/notificationActions';
import '../../../assets/scss/components/top-notification.scss';

import { Offline } from 'react-detect-offline';

class StatusNotification extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'top-notification-container' + ' ' + (this.props.notification.success ? 'notification-success' : 'notification-danger') + ' ' + (!this.props.notification.show ? 'notification-hide' : '')}>
                <p>{this.props.notification.content}</p>
                <Offline onChange={online => {
                    if (!online) {
                        this.props.showNotification('No connection! Check your network or find a better signal!', false);
                    }
                    else {
                        this.props.hideNotification();
                    }
                }}></Offline>
            </div>
        );
    }

}

export default connect(state => state, notificationActions)(StatusNotification);