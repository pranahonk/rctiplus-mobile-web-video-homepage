import React from 'react';
import Player from '../../components/Includes/Player/Player';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: '',
    };
  }

  render() {
    return (
      <>
        <Player />
      </>
    );
  }
}

export default Index;
