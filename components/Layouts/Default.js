import React, { Component, useState, useEffect } from 'react';
import Head from 'next/head';
import { Offline } from "react-detect-offline";

//load scss style 
import '../../assets/scss/custom.scss';
import '../../assets/scss/global.scss';
import 'sweetalert2/src/sweetalert2.scss';

import '../../assets/scss/components/alert.scss';

//load redux
import { connect } from 'react-redux';
import actions from '../../redux/actions';

//load footer
import Footer from '../../components/Includes/Footer/Default';

const Default = ({ children, title }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	let noConnectionRef = React.createRef();

	useEffect(
		() =>
			function () {
				if (typeof window !== 'undefined') {
					window.addEventListener('beforeinstallprompt', async e => {
						// beforeinstallprompt Event fired
						try {
							// e.userChoice will return a Promise.
							const choiceResult = await e.userChoice;
							if (choiceResult.outcome === 'dismissed') {
								/* eslint-disable no-console */
								console.log('User cancelled home screen install');
								/* eslint-enable no-console */
							} else {
								/* eslint-disable no-console */
								console.log('User added to home screen');
								/* eslint-enable no-console */
							}
						} catch (error) {
							/* eslint-disable no-console */
							console.error(
								'user choice prompt promise failed to resolve, error: ',
								error,
							);
							/* eslint-enable no-console */
						}
					});
				}
			},
		[],
	);

	return (
		<div>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/static/logo/rcti.png?v=1.0" />
				<link rel="manifest" href="/static/manifest.json" />
				<script src="https://use.fontawesome.com/e1f61e4a83.js"></script>
			</Head>
				{/* <Offline onChange={(online) => {
					noConnectionRef.current.classList.remove('no-connection-open');
					noConnectionRef.current.classList.remove('no-connection-closed');

					if (!online) {
						noConnectionRef.current.classList.add('no-connection-open');
					}
					else {
						noConnectionRef.current.classList.add('no-connection-closed');
					}
				}}></Offline>
				<div ref={noConnectionRef} className="row no-connection">
					<div className="col-md-12 col-xs-12">No connection! Check your network or find a better signal!</div>
				</div> */}
			
			<div style={{ overflowX: 'hidden', marginTop: -5 }} id="wr" className="wrapper has-text-centered">{children}</div>

			<Footer />
		</div>
	)
}

export default connect(state => state, actions)(Default);
