import React from 'react';
import Styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import '../../../assets/scss/components/style-components/button.scss';
import Ripples from 'react-ripples';
export const ButtonOutline = ({icon, text, className, onclick }) => {
  return (
    <>
      <Button outline onClick={ onclick } className={'button-content ' + className}>
        { icon } { text }
      </Button>
    </>
  );
};

export const ButtonPrimary = ({icon, text, onclick, className, key, status}) => {
  const onClick = () => {
    console.log('CLICKKKKK', status[0])
    if (!status[0]) {
      status[1]();
      return false;
    }
    onclick();
  };
  return (
      <>
        <Ripples color="#282828" className={'button-detail ' + className }>
          <button onClick={() => {onClick()}}>
            { icon }
            <h3>{ text }</h3>
          </button>
        </Ripples>
      </>
  );
};

const ButtonWrapper = Styled.div`
  .button-content {
    display: flex;
    padding: 4px 18px;
    background-color: transparent;
    margin: 0;
    width: auto;
    color: #ffffff;
    border-color: #ffffff;
    margin: 0 10px;
    align-items: center;
    .MuiSvgIcon-root {
      font-size: 1.8rem;
    }
    &:first-child {
      padding-left: 0;
    }
    &:active {
      background-color: #000000;
      transform: scale(0.8);
      transition: transform .4s;
    }
  }
`;

ButtonOutline.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
  onclick: PropTypes.func,
};
ButtonOutline.defaultProps = {
  className: '',
  onclick: () => console.log('CLICK'),
};
ButtonPrimary.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
};
ButtonPrimary.defaultProps = {
  status: [true, true],
  onclick: () => console.log('CLICK'),
  className: '',
}

