import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Ripples from 'react-ripples';

const RippleButton = ({ rippleColor, during, ...rest }) => {
  return (
    <Ripples color={rippleColor} during={during}>
      <Button {...rest} />
    </Ripples>
  );
};

RippleButton.propTypes = {
  ...Button.propTypes,
  rippleColor: PropTypes.string,
  during: PropTypes.number,
};

Button.RippleButton = RippleButton;
