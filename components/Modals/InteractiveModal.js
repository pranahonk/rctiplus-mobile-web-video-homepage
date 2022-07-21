import React from 'react';
import { Modal, ModalBody, Row, Button } from 'reactstrap';
import { homeGeneralClicked } from '../../utils/appier';
import { gaVideoInteractive } from '../../utils/ga-360';

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
            <Button block className='mt-3 btn-primary-interactive' onClick={() => {
              gaVideoInteractiventeractive("video_interaction", "video_click_go_to_aplikasir+", "redirect_to_visionplus")
              homeGeneralClicked('mweb_homepage_install_button_clicked');
              window.open('https://onelink.to/apprctiplus', '_blank');
            }}>Install Aplikasi RCTI+</Button> 
            <Button block color='link' className='mt-1 text-danger' onClick={()=>{
              props.toggle
              gaVideoInteractiventeractive("video_interaction", "video_click_go_to_close", "redirect_to_visionplus")
              }}>Close</Button> 
          </Row>
        </ModalBody>
    </Modal>
  );
};

export default InteractiveModal