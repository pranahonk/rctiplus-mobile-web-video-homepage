import React from 'react';
import { Modal, ModalBody, Row, Button } from 'reactstrap';

import '../../assets/scss/components/modal.scss';
import '../../assets/scss/components/action-sheet.scss';
import { homeGeneralClicked } from '../../utils/appier';

const InteractiveModal = (props) => {
  return (
    <Modal className="modal-interactive" isOpen={props.open} toggle={props.toggle}>
        <ModalBody className="modal-body">
          <Row className='justify-content-center'>
            <img 
              src='/static/img/install-r+.png'
              width={200}
              height={200}
              alt="install - R+"
            />
            <p style={{fontSize: '16px', fontWeight: 'bold'}}>Nikmati keseruannya di aplikasi RCTI+</p>
            <p style={{fontSize: '11px'}}>Fitur Interactive hanya terdapat di aplikasi Android dan aplikasi iOS</p>         
            <Button block color='primary' className='mt-3' onClick={() => {
              homeGeneralClicked('mweb_homepage_install_button_clicked');
              window.open('https://onelink.to/apprctiplus', '_blank');
            }}>Install Aplikasi RCTI+</Button> 
            <Button block color='link' className='mt-1 text-danger' onClick={props.toggle}>Close</Button> 
          </Row>
        </ModalBody>
    </Modal>
  );
};

export default InteractiveModal