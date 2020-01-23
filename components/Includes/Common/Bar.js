import React from 'react';
import '../../../assets/scss/components/bar.scss';

function Bar(props) {
    return (
        <div className="bar-container">
            <div className="bar-progress" style={{ width: `${props.percentage}%` }}></div>
        </div>
    );
}

export default Bar;