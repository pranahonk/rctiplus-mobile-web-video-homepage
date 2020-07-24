import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, Input  } from 'reactstrap';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Autosuggest from 'react-autosuggest';
import smoothscroll from 'smoothscroll-polyfill';
import '../../assets/scss/components/modal.scss';
if (typeof window !== 'undefined') {
  smoothscroll.polyfill();
}
const CountryList = (props) => {
  const [search, setSearch] = useState(false);
  const [state, setState] = useState({
    value: '',
    suggestions: [],
  });
  const onChangeSearch = (e) => {
    setState({value: e.currentTarget.value});
  };
  const getByChar = (e) => {
    document.querySelector(`.${e}-coutry-code`).scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    // console.log('TESYYYYY')
    return () => {
      // console.log('testttt return')
    }
  })
  return (
    <Modal isOpen={props.modal} toggle={() => props.toggle()} className={props.className}>
      <div className="navbar-header">
        <div className="back-icon">
          <KeyboardBackspaceIcon onClick={() => {
            props.toggle();
          }}/>
        </div>
        { search ? (
          <div className="flex-display">
            <Input type="text" autoFocus={true} name="search" id="search" placeholder="Search Country" className="search-text input-search" onChange={(e) => onChangeSearch(e) }/>
            <div className="search-action" onClick={ () => {
              setSearch(!search);
              setState({value: ''});
              }}><HighlightOffIcon /></div>
          </div>
        ) : (
          <div className="flex-display">
            <div className="search-text">Select Country</div>
            <div className="search-action" onClick={ () => {
              setSearch(!search);
            }}><SearchIcon /></div>
          </div>
        ) }
        </div>
      <ModalBody className="body-list">
        <div className="list-country">
          { props.data &&
            props.data.data &&
            props.data.data.filter((item) => item.name.toLowerCase().includes(state.value.toLowerCase())).map((item, i) => {
            return (
              <div onClick={() => {
                props.toggle();
                props.getCountryCode(item);
              }} className={'country-item ' + item.name.charAt(0) + '-coutry-code'} key={i}>
                <span>{item.name}</span>
                <span>+{item.phone_code}</span>
              </div>);
          })}
        </div>
        { !search ? (
          <div className="select-alphabet">
          {
              alphabet.map((item, i) => {
                return (
                    <span onClick={() => getByChar(item)} key={i} style={{display: 'block'}}>{item}</span>
                    );
              })
            }
          </div>
        ) : (<div className="select-alphabet" />)}
      </ModalBody>
    </Modal>
  );
};

export default CountryList;

const alphabet = [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z',
            ];
