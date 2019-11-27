import React, { Component, useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
/*
*load scss style 
*start here
*/
import '../../assets/scss/custom.scss';
import '../../assets/scss/global.scss';
/*
*load scss style 
*end here
*/
/*
*load redux 
*start here
*/
import { connect } from 'react-redux';
import actions from '../../redux/actions';
/*
*load redux 
*end here
*/
/*
*load default nav 
*start here
*/
import NavbarDefault from '../Nav/NavDefault';
/*
*load default nav 
*end here
*/

import Footer from '../../components/Footer/Default';

const Layout = ({ children, title, isAuthenticated, deauthenticate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(
    () =>
      function() {
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
        <link rel="icon" href="static/icons/favicon.png" />
        <link rel="manifest" href="static/manifest.json" />
        <script src="https://kit.fontawesome.com/18a4a7ecd2.js" crossOrigin="anonymous"></script>
      </Head>
      <div className="has-text-centered">{children}</div>
	  
	  <Footer/>
    </div>
  );
};

export default connect(state => state, actions)(Layout);
