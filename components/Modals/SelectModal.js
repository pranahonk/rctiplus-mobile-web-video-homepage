import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import contentActions from '../../redux/actions/contentActions';

import { Modal, ModalBody } from 'reactstrap';
import queryString from 'query-string';
import { programSeasonEvent } from '../../utils/appier';

import CancelIcon from '@material-ui/icons/Cancel';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/select-modal.scss';

class SelectModal extends React.Component {

    constructor(props) {
        super(props);
        const segments = this.props.router.asPath.split(/\?/);
        this.reference = null;
        if (segments.length > 1) {
            const q = queryString.parse(segments[1]);
            if (q.ref) {
                this.reference = q.ref;
            }
		}
    }

    selectSeason(season, programId) {
        this.props.selectSeason(season)
            .then(_ => {
                this.props.getProgramEpisodes(programId, season)
                    .then(response => {
                        if (response.status === 200 && response.data.status.code === 0) {
                            if (this.props.program && this.reference && this.reference == 'homepage') {
                                const data = this.props.program.data;
                                programSeasonEvent(programId, data.title, season, 'mweb_homepage_program_season_clicked');
                            }
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

export default connect(state => state, contentActions)(withRouter(SelectModal));