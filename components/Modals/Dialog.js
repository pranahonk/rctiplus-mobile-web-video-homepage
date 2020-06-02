import React, { useState } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { Modal } from 'reactstrap';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fetchEpisode, seasonSelected } from '../../redux/actions/program-detail/programDetail';

class Dialog extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      modal : false,
    };
  }
  toggle() {this.setState({ modal: !this.state.modal });}

  render() {
    const isStoreSeason = Object.keys(this.props.dialog && this.props.dialog['program-episode']);
                          
    return (
      <div>
        <button onClick={() => this.toggle()} style={style}>
              Season { this.props.selected }<ExpandMoreIcon />
        </button>
        <Modal className="modal-custom dialog-modal" isOpen={this.state.modal} toggle={this.toggle}>
          <div className="dialog-content-modal">
            <div className="main-modal-container">
              {this.props.dialog && this.props.dialog.season && this.props.dialog.season.data.map((item, i) => {
                  
                  return (
                    <button key={i}
                      style={{fontSize: this.props.dialog && this.props.dialog.seasonSelected === item.season ? '24px' : 'inherit', 
                              fontWeight: this.props.dialog && this.props.dialog.seasonSelected === item.season ? 'bold' : 'inherit'}}
                      className="season-list-item"
                      onClick={() => {
                      if (isStoreSeason.filter((filter) => filter === 'season-'+item.season).length === 0) {
                        this.props.dispatch(fetchEpisode(item.program_id,'program-episode',item.season));
                        this.props.dispatch(seasonSelected(item.season));
                      }
                      this.props.dispatch(seasonSelected(item.season));
                      this.toggle();
                      }}>
                      Season {item.season}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className="close-modal">
            <CancelIcon className="close-icon-select" onClick={() => this.toggle()}/>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { Program } = state;
  return { dialog: Program };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Dialog);

const style = {
  background: 'none',
  border: 'none',
  color: '#fff',
  padding: '10px 0 0 0',
  fontSize: '12px',
  outline: 'none'
};
