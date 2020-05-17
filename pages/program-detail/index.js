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
        <div className="program-detail-player-container">
          <Player />
        </div>
      </>
    );
  }
}

export default Index;
