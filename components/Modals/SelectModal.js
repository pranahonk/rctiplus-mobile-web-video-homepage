import React from 'react';
import { connect } from 'react-redux';

import contentActions from '../../redux/actions/contentActions';

import { Modal, ModalBody } from 'reactstrap';

import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/select-modal.scss';

class SelectModal extends React.Component {

    constructor(props) {
        super(props);
    }

    selectSeason(season, programId) {
        this.props.selectSeason(season)
            .then(_ => {
                this.props.getProgramEpisodes(programId, season)
                    .then(response => {
                        if (response.status === 200 && response.data.status.code === 0) {
                            this.props.setShowMoreAllowed(this.props.contents.episodes.length >= this.props.episodeListLength); 
                        }
                        this.props.toggle();
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.toggle();
                    });
            });
    }

    render() {
        return (
            <Modal className="select-modal" isOpen={this.props.open} toggle={this.props.toggle}>
                <ModalBody>
                    <div className="season-list">
                        {this.props.data.map((d, i) => (<h4 key={i} onClick={this.selectSeason.bind(this, d.season, d.program_id)}>Season {d.season}</h4>))}
                    </div>
                    <div className="close-container-select">
                        <CancelIcon className="close-icon-select" onClick={this.props.toggle}/>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

}

export default connect(state => state, contentActions)(SelectModal);