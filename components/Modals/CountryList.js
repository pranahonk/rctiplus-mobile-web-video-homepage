import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from '@material-ui/icons/Search';

import '../../assets/scss/components/modal.scss';

const CountryList = (props) => {
  const [search, setSearch] = useState(false);
  return (
    <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
      <div className="navbar-header">
        <div className="back-icon">
          <KeyboardBackspaceIcon onClick={props.toggle}/>
        </div>
          <div className="search-text">Select Country</div>
          <div className="search-action" onClick={ () => {} }><SearchIcon /></div>
        </div>
      <ModalBody className="body-list">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.toggle}>Do Something</Button>{' '}
        <Button color="secondary" onClick={props.toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default CountryList;