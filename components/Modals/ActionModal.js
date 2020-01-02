import React from 'react';
import { connect } from 'react-redux';
import { showSignInAlert } from '../../utils/helpers';

import likeActions from '../../redux/actions/likeActions';

import { Modal, ModalBody } from 'reactstrap';

import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-modal.scss';

class ActionModal extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
        
    }

    postLike(status) {
        this.props.postLike(this.props.programId, this.props.type, status)
            .then(response => {
                this.props.getLikeHistory(this.props.programId)
                    .then(_ => this.props.toggle())
                    .catch(error => this.props.toggle());
            })
            .catch(error => {
                console.log(error);
                if (error.data && error.data.status.code === 13) {
                    showSignInAlert(`Please <b>Sign In</b><br/>
                    Woops! Gonna sign in first!<br/>
                    Only a click away and you<br/>
                    can continue to enjoy<br/>
                    <b>RCTI+</b>`, '', () => {}, true, 'Sign Up', 'Sign In', true, true);
                }
            });
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalBody>
                    <ThumbUpAltOutlinedIcon onClick={this.postLike.bind(this, 'LIKE')} className="modal-icon"/>
                    <ThumbDownOutlinedIcon onClick={this.postLike.bind(this, 'DISLIKE')} className="modal-icon"/>
                    <div className="close-container">
                        <CancelIcon className="close-icon" onClick={this.props.toggle}/>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, likeActions)(ActionModal);