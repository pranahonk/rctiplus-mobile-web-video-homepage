import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import WarningIcon from '@material-ui/icons/Warning';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';

export const GeoblockModal = (props) => {
  console.log(props.open)
  return (
    <Modal className="modal-geo" isOpen={props.open} toggle={props.toggle}>
        <CloseIcon id="close-action-sheet" className="close-icon-button" onClick={props.toggle}/>
        <ModalBody className="modal-body-geo">
            <div><WarningIcon/> </div>
            <div>{ props.text }</div>
        </ModalBody>
    </Modal>
  );
};