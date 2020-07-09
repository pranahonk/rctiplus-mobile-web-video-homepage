import React, { useState } from 'react';
import { Button, Modal, ModalBody, Input  } from 'reactstrap';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Autosuggest from 'react-autosuggest';

import '../../assets/scss/components/modal.scss';

const CountryList = (props) => {
  const [search, setSearch] = useState(false);
  const [state, setState] = useState({
    value: '',
    suggestions: [],
  });
  const onChangeSearch = (e) => {
    setState({value: e.currentTarget.value})
  }
  return (
    <Modal isOpen={props.modal} toggle={props.toggle} className={props.className}>
      <div className="navbar-header">
        <div className="back-icon">
          <KeyboardBackspaceIcon onClick={props.toggle}/>
        </div>
        { search ? (
          <div className="flex-display">
            <Input type="text" autoFocus={true} name="search" id="search" placeholder="Search Country" className="search-text input-search" onChange={(e) => onChangeSearch(e) }/>
            <div className="search-action" onClick={ () => { setSearch(!search); } }><HighlightOffIcon /></div>
          </div>
        ) : (
          <div className="flex-display">
            <div className="search-text">Select Country</div>
            <div className="search-action" onClick={ () => { setSearch(!search); } }><SearchIcon /></div>
          </div>
        ) }
        </div>
      <ModalBody className="body-list">
        <div className="list-country">
          { props.data &&
            props.data.data &&
            props.data.data.filter((item) => item.name.toLowerCase().includes(state.value)).map((item, i) => {
            return (
              <div className="country-item" key={i}>
                <span>{item.name}</span>
                <span>+{item.phone_code}</span>
              </div>);
          })}
        </div>
        <div className="select-alphabet">testtt2</div>
      </ModalBody>
    </Modal>
  );
};

export default CountryList;

const languages = [
  {
    name: 'C',
    year: 1972,
  },
  {
    name: 'Elm',
    year: 2012,
  },
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);
