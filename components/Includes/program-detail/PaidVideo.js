import React from 'react';
import { Button } from 'reactstrap';

const PaidVideo = () => {
    return (
      <React.Fragment>
        <div className="paid__video-wrapper">
          <div className="paid__video-content">
            <div className="content-wrapper">
              <h1 className="content-title">
                Semangat Agustus
              </h1>
              <h2 className="content-price">
                Rp 10 RIBU
              </h2>
            </div>
            <div className="action">
              <Button color="danger" className="btn-paid__video">Purchase</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
}

export default PaidVideo;