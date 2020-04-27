import React from 'react';

class ErrorPlayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { iconError, title, content1, content2, status, statusCode } = this.props;
    return (
        <div>
					<span />
					<div style={{
						textAlign: 'center',
						padding: 30,
						minHeight: 180,
					}}>
						{ iconError }
            <h5 style={{ color: '#8f8f8f' }}>
							{status && statusCode === 12 ? (
								<div>
									<span style={{ fontSize: 12 }}>{ title }</span>
								</div>
							) : (
								<div>
									<p style={{ fontSize:12, color: '#ffffff', margin: '5px' }}>{ title }</p>
									<span style={{ fontSize: 12 }}>{ content1 }</span><br />
									<span style={{ fontSize: 12 }}>{ content2 }</span>
								</div>
							)}
						</h5>
					</div>
				</div>
    );
  }
}


export default ErrorPlayer;
