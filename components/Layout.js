import '../assets/scss/custom.scss';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { connect } from 'react-redux';
import actions from '../redux/actions';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

const Layout = ({ children, title, isAuthenticated, deauthenticate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => function () {
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
    }, []);

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="icon" href="static/icons/rcti_32.png" />
                <link rel="manifest" href="static/manifest.json" />
            </Head>
            <div>
                {children}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({ isAuthenticated: !!state.authentication.token });

export default connect(mapStateToProps, actions)(Layout);