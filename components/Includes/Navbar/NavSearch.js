import React, { Component, useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/router'
import searchActions from '../../../redux/actions/searchActions';
import pageActions from '../../../redux/actions/pageActions';

import '../../../assets/scss/components/navbar-search.scss';

import { Navbar, NavbarBrand, Input } from 'reactstrap';

import StatusNotification from './StatusNotification';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

import _isEmpty from "lodash/isEmpty";
import _debounce from "lodash/debounce";
// import { Subject } from 'rxjs';
// import { debounceTime } from 'rxjs/operators';

import { libraryGeneralEvent, searchKeywordEvent, searchBackClicked } from '../../../utils/appier';

const NavbarSearch = ({...props}) => {
    const router = useRouter()
    const [state, setState] = useState({q: router.query.q || '', length: 9})
    useEffect(() => {
        if(!_isEmpty(state.q)) {
            props.setPageLoader();
                props.searchAllCategory(state.q, 1, state.length)
                    .then(responses => {
                        console.log(responses);
                        props.unsetPageLoader();
                    })
                    .catch(error => {
                        console.log(error);
                        props.unsetPageLoader();
                });
        }
    }, [])
    const _onChangeQuery = (e) => {
        setState({ ...state, q: e.target.value });
        _delayedQuery(e.target.value)
    }
    const _bottomScrollFetch = () => {
        if (state.q && props.searches.search_show_more_allowed[props.searches.active_tab]) {
            console.log('testt tab')
            props.searchCategory(state.q, props.searches.active_tab, props.searches.search_page[props.searches.active_tab], state.length)
                .then(response => {

                })
                .catch(error => {
                    console.log(error);

                });
        }
    }
    const _clearKeyword = () => {
        searchKeywordEvent(state.q, 'mweb_search_clear_keyword_clicked');
        setState({ ...state, q: '' });
    }
    const _search = (value) => {
        router.replace(`/explores/search?q=${value}`, `/explores/keyword?q=${value}`, { shallow: true })
    }
    const _delayedQuery = useCallback(_debounce(q => _search(q), 500), [])
    return(
        <div className="nav-home-container nav-fixed-top">
            <BottomScrollListener offset={8} onBottom={() => _bottomScrollFetch()} />
            <Navbar expand="md" className={'nav-container nav-shadow nav-search'}>
                {/* <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} /> */}
                <div className="left-top-link">
                    <div className="logo-top-wrapper">
                        <NavbarBrand onClick={() => {
                            if (router.asPath.indexOf('/explores') === 0) {
                                searchBackClicked(state.q, 'mweb_search_back_clicked');
                            }
                            router.back()
                        }} style={{ color: 'white' }}>
                            <ArrowBackIcon />
                        </NavbarBrand>
                    </div>
                </div>
                <div className="middle-top">
                    <Input
                        id="input-search"
                        onClick={() => libraryGeneralEvent('mweb_library_search_form_clicked')}
                        placeholder="Search for a program, genre, etc."
                        onChange={(e) => _onChangeQuery(e)}
                        value={state.q}
                        className="search-input" />
                </div>
                <div className="right-top-link">
                    <div className="btn-link-top-nav">
                        <NavbarBrand style={{ color: 'white' }}>
                            <CloseIcon style={{ fontSize: 20, marginRight: 10, visibility: (state.q.length > 0 ? 'visible' : 'hidden') }} onClick={_clearKeyword}/>
                            <SearchIcon style={{ fontSize: 20 }} onClick={() => {
                                console.log('search')
                            }} />
                        </NavbarBrand>
                    </div>
                </div>
            </Navbar>
            <StatusNotification />
        </div>
    )
}

export default connect(state => state, {
    ...searchActions,
    ...pageActions
})(NavbarSearch);

// class NavbarSearch extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             q: '',
//             length: 9
//         };

//         // this.subject = new Subject();
//     }

//     componentDidMount() {
//         // this.subject
//         //     .pipe(debounceTime(1000))
//         //     .subscribe(() => {
//         //         if (this.state.q) {
//         //             searchKeywordEvent(this.state.q, 'mweb_search_keyword');
//         //         }

//         //         this.props.searchAllCategory(this.state.q, 1, this.state.length)
//         //             .then(responses => {
//         //                 console.log(responses);
//         //                 this.props.unsetPageLoader();
//         //             })
//         //             .catch(error => {
//         //                 console.log(error);
//         //                 this.props.unsetPageLoader();
//         //             });
//         //     });
//     }

//     onChangeQuery(e) {
//         console.log(e)
//         // Router.push(`/explores/search?q=${e.target.value}`, `/explores/keyword?q=${e.target.value}`)
//         this.changeQuery(e.target.value);
//         // if (e.target.value) {
//         //     searchKeywordEvent(e.target.value, 'mweb_search_keyword');
//         // }

//         // this.props.searchAllCategory(e.target.value, 1, this.state.length)
//         //     .then(responses => {
//         //         console.log(responses);
//         //         this.props.unsetPageLoader();
//         //     })
//         //     .catch(error => {
//         //         console.log(error);
//         //         this.props.unsetPageLoader();
//         // });
//     }
//     delayedQuery = React.useCallback()
//     changeQuery(q) {
//         this.setState({ q: q });
//     }

//     bottomScrollFetch() {
//         if (this.state.q && this.props.searches.search_show_more_allowed[this.props.searches.active_tab]) {
//             this.LoadingBar.continuousStart();
//             this.props.searchCategory(this.state.q, this.props.searches.active_tab, this.props.searches.search_page[this.props.searches.active_tab], this.state.length)
//                 .then(response => {
//                     this.LoadingBar.complete();
//                 })
//                 .catch(error => {
//                     console.log(error);
//                     this.LoadingBar.complete();
//                 });
//         }
//     }

//     clearKeyword() {
//         searchKeywordEvent(this.state.q, 'mweb_search_clear_keyword_clicked');
//         this.setState({ q: '' }, () => {
//             this.changeQuery(this.state.q);
//         });
//     }

//     render() {
//         return (
//             <div className="nav-home-container nav-fixed-top">
//                 <BottomScrollListener offset={8} onBottom={this.bottomScrollFetch.bind(this)} />
//                 <Navbar expand="md" className={'nav-container nav-shadow nav-search'}>
//                     <LoadingBar progress={0} height={3} color='#fff' onRef={ref => (this.LoadingBar = ref)} />
//                     <div className="left-top-link">
//                         <div className="logo-top-wrapper">
//                             <NavbarBrand onClick={() => {
//                                 if (this.props.router.asPath.indexOf('/explores') === 0) {
//                                     searchBackClicked(this.state.q, 'mweb_search_back_clicked');
//                                 }
//                                 Router.back();
//                             }} style={{ color: 'white' }}>
//                                 <ArrowBackIcon />
//                             </NavbarBrand>
//                         </div>
//                     </div>
//                     <div className="middle-top">
//                         <Input
//                             onClick={() => libraryGeneralEvent('mweb_library_search_form_clicked')}
//                             placeholder="Search for a program, genre, etc."
//                             onChange={this.onChangeQuery.bind(this)}
//                             value={this.state.q}
//                             className="search-input" />
//                     </div>
//                     <div className="right-top-link">
//                         <div className="btn-link-top-nav">
//                             <NavbarBrand style={{ color: 'white' }}>
//                                 <CloseIcon style={{ fontSize: 20, marginRight: 10, visibility: (this.state.q.length > 0 ? 'visible' : 'hidden') }} onClick={this.clearKeyword.bind(this)}/>
//                                 <SearchIcon style={{ fontSize: 20 }} onClick={() => {
//                                     this.changeQuery(this.state.q);
//                                 }} />
//                             </NavbarBrand>
//                         </div>
//                     </div>
//                 </Navbar>
//                 <StatusNotification />
//             </div>
//         );
//     }
// }
// export default connect(state => state, {
//     ...searchActions,
//     ...pageActions
// })(withRouter(NavbarSearch));

