(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"1TCz":function(t,e,n){"use strict";n.r(e);var a=n("hfKm"),r=n.n(a),u=n("2Eek"),o=n.n(u),s=n("XoMD"),i=n.n(s),c=n("Jo+v"),l=n.n(c),p=n("4mXO"),d=n.n(p),f=n("pLtp"),h=n.n(f),E=n("ln6h"),_=n.n(E),v=n("vYYK"),g=n("O40h"),T=n("0iUn"),m=n("sLSF"),O=n("MI3g"),w=n("a7VT"),y=n("Tit0"),b=n("q1tI"),I=n.n(b),S=n("/MKj"),P=n("8Bbg"),R=n.n(P),A=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function a(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(a.prototype=n.prototype,new a)}}(),N=function(){return(N=Object.assign||function(t){for(var e,n=1,a=arguments.length;n<a;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)},G=function(t,e,n,a){return new(n||(n=Promise))(function(r,u){function o(t){try{i(a.next(t))}catch(e){u(e)}}function s(t){try{i(a.throw(t))}catch(e){u(e)}}function i(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(o,s)}i((a=a.apply(t,e||[])).next())})},C=function(t,e){var n,a,r,u,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return u={next:s(0),throw:s(1),return:s(2)},"function"===typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function s(u){return function(s){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,a&&(r=2&u[0]?a.return:u[0]?a.throw||((r=a.return)&&r.call(a),0):a.next)&&!(r=r.call(a,u[1])).done)return r;switch(a=0,r&&(u=[2&u[0],r.value]),u[0]){case 0:case 1:r=u;break;case 4:return o.label++,{value:u[1],done:!1};case 5:o.label++,a=u[1],u=[0];continue;case 7:u=o.ops.pop(),o.trys.pop();continue;default:if(!(r=(r=o.trys).length>0&&r[r.length-1])&&(6===u[0]||2===u[0])){o=0;continue}if(3===u[0]&&(!r||u[1]>r[0]&&u[1]<r[3])){o.label=u[1];break}if(6===u[0]&&o.label<r[1]){o.label=r[1],r=u;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(u);break}r[2]&&o.ops.pop(),o.trys.pop();continue}u=e.call(t,o)}catch(s){u=[6,s],a=0}finally{n=r=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,s])}}},k=function(t,e){var n={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(n[a]=t[a]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(t);r<a.length;r++)e.indexOf(a[r])<0&&Object.prototype.propertyIsEnumerable.call(t,a[r])&&(n[a[r]]=t[a[r]])}return n},L={storeKey:"__NEXT_REDUX_STORE__",debug:!1,serializeState:function(t){return t},deserializeState:function(t){return t}},x=n("Wl4k"),U=n("ANjH");function D(t){return function(e){var n=e.dispatch,a=e.getState;return function(e){return function(r){return"function"===typeof r?r(n,a,t):e(r)}}}}var j=D();j.withExtraArgument=D;var W=j,M=n("Qetd"),H=n.n(M),K=n("9uw5"),B={token:null,user:null,data:null,message:null,code:null},Y={homepage_content:[],banner:null,meta:null,data:null,status:null},z={data:null,meta:null,status:null,image_path:null,video_path:null},V={data:null,meta:null,status:null,otp:null,username:null,password:null,fullname:null,dob:null,gender:null,device_id:null,username_type:null},X={data:null,meta:null,status:null},F={data:null,meta:null,status:null},q={data:null,meta:null,status:null},Q={data:null,meta:null,status:null},Z={data:null,meta:null,status:null},J={data:null,meta:null,status:null},$={content:"",show:!1,success:!0,size:"small"},tt=Object(U.c)({authentication:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:B,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case K.a:return H()({},t,{token:e.token,data:e.data});case K.c:return H()({},t,{user:e.payload});case K.b:return{token:null};case K.d:return H()({},t,{message:e.message,code:e.code});default:return t}},contents:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Y,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"HOMEPAGE_CONTENT":return H()({},t,{homepage_content:e.data,meta:e.meta});case"BANNER":return H()({},t,{banner:e.data,meta:e.meta});case"GET_HOMEPAGE_CONTENTS":case"GET_EPISODE_DETAIL":case"GET_EPISODE_URL":case"GET_EXTRA_DETAIL":case"GET_EXTRA_URL":case"GET_CLIP_DETAIL":case"GET_CLIP_URL":case"GET_PHOTO_DETAIL":return H()({},t,{meta:e.meta,data:e.data,status:e.status});default:return t}},stories:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:z,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"STORIES":return H()({},t,{data:e.data,image_path:e.image_path,video_path:e.video_path});case"GET_STORY":case"GET_PROGRAM_STORIES":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},registration:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:V,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"REGISTER":return H()({},t,{data:e.data,meta:e.meta});case"CHECK_USER":case"FORGOT_PASSWORD":case"CREATE_NEW_PASSWORD":return H()({},t,{status:e.status});case"USERNAME":return H()({},t,{username:e.username});case"PASSWORD":return H()({},t,{password:e.password});case"FULLNAME":return H()({},t,{fullname:e.fullname});case"GENDER":return H()({},t,{gender:e.gender});case"DOB":return H()({},t,{dob:e.dob});case"USERNAME_TYPE":return H()({},t,{username_type:e.username_type});default:return t}},user:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:X,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"UPDATE_PROFILE":case"CHECK_USER":return H()({},t,{status:e.status});case"USER_DATA":return H()({},t,{data:e.data,meta:e.meta});case"INTERESTS":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},bookmarks:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:F,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"MY_LIST":case"BOOKMARK":case"GET_BOOKMARKS":case"GET_BOOKMARK":case"GET_LIST_BOOKMARK":case"GET_LIST_BOOKMARK_BY_ID":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},histories:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:q,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"USER_HISTORY":case"POST_HISTORY":case"DELETE_HISTORY":case"CONTINUE_WATCHING":case"CONTINUE_WATCHING_BY_CONTENT_ID":case"DELETE_CONTINUE_WATCHING_BY_CONTENT_ID":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},searches:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Q,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"SEARCH":case"SEARCH_BY_GENRE":case"GET_RECOMMENDATION":case"GET_RELATED_PROGRAM":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},quizzes:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Z,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"SUBMIT_ANSWER":case"QUIZ_RESULT":return H()({},t,{data:e.data,meta:e.meta,status:e.status});default:return t}},chats:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:J,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"POST_CHAT":case"GET_LIVE_EVENT":case"GET_LIVE_EVENT_DETAIL":case"GET_LIVE_EVENT_URL":case"GET_LIVE_QUIZ":case"GET_LIVE_QUIZ_URL":case"GET_EPG":case"GET_CATCHUP_URL":return H()({},t,{status:e.status,data:e.data,meta:e.meta});default:return t}},notification:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:$,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"SHOW_NOTIFICATION":return H()({},t,{content:e.content,show:e.show,success:e.success,size:e.size});case"HIDE_NOTIFICATION":return H()({},t,{show:e.show});default:return t}}}),et=I.a.createElement;function nt(t,e){var n=h()(t);if(d.a){var a=d()(t);e&&(a=a.filter(function(e){return l()(t,e).enumerable})),n.push.apply(n,a)}return n}function at(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nt(Object(n),!0).forEach(function(e){Object(v.a)(t,e,n[e])}):i.a?o()(t,i()(n)):nt(Object(n)).forEach(function(e){r()(t,e,l()(n,e))})}return t}e.default=function(t,e){e=N({},L,e);var n="undefined"===typeof window,a=function(a){var r=a.initialState,u=a.ctx,o=e.storeKey,s=function(){return t(e.deserializeState(r),N({},u,e,{isServer:n}))};return n?s():(window.hasOwnProperty(o)||(window[o]=s()),window[o])};return function(t){var r;return(r=function(n){function r(t,r){var u=n.call(this,t,r)||this,o=t.initialState;return e.debug&&console.log("4. WrappedApp.render created new store with initialState",o),u.store=a({initialState:o}),u}return A(r,n),r.prototype.render=function(){var e=this.props,n=e.initialProps,a=(e.initialState,k(e,["initialProps","initialState"]));return I.a.createElement(t,N({},a,n,{store:this.store}))},r}(b.Component)).displayName="withRedux("+(t.displayName||t.name||"App")+")",r.getInitialProps=function(r){return G(void 0,void 0,void 0,function(){var u,o;return C(this,function(s){switch(s.label){case 0:if(!r)throw new Error("No app context");if(!r.ctx)throw new Error("No page context");return u=a({ctx:r.ctx}),e.debug&&console.log("1. WrappedApp.getInitialProps wrapper got the store with state",u.getState()),r.ctx.store=u,r.ctx.isServer=n,o={},"getInitialProps"in t?[4,t.getInitialProps.call(t,r)]:[3,2];case 1:o=s.sent(),s.label=2;case 2:return e.debug&&console.log("3. WrappedApp.getInitialProps has store state",u.getState()),[2,{isServer:n,initialState:e.serializeState(u.getState()),initialProps:o}]}})})},r}}(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object(U.d)(tt,t,Object(U.a)(W))},{debug:!1})(function(t){function e(){return Object(T.a)(this,e),Object(O.a)(this,Object(w.a)(e).apply(this,arguments))}return Object(y.a)(e,t),Object(m.a)(e,[{key:"componentDidMount",value:function(){Object(x.register)()}},{key:"componentWillUnmount",value:function(){Object(x.unregister)()}},{key:"render",value:function(){var t=this.props,e=t.Component,n=t.pageProps,a=t.store;return et(S.a,{store:a},et(e,n))}}],[{key:"getInitialProps",value:function(){var t=Object(g.a)(_.a.mark(function t(e){var n,a;return _.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.Component,a=e.ctx,t.t0=at,t.t1={},!n.getInitialProps){t.next=9;break}return t.next=6,n.getInitialProps(a);case 6:t.t2=t.sent,t.next=10;break;case 9:t.t2={};case 10:return t.t3=t.t2,t.t4=(0,t.t0)(t.t1,t.t3),t.abrupt("return",{pageProps:t.t4});case 13:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()}]),e}(R.a))},"8Bbg":function(t,e,n){t.exports=n("B5Ud")},B5Ud:function(t,e,n){"use strict";var a=n("/HRN"),r=n("WaGi"),u=n("ZDA2"),o=n("/+P4"),s=n("N9n2"),i=n("ln6h"),c=n("KI45");e.__esModule=!0,e.Container=function(t){0;return t.children},e.createUrl=v,e.default=void 0;var l=c(n("htGi")),p=c(n("+oT+")),d=c(n("q1tI")),f=n("g/15");function h(t){return E.apply(this,arguments)}function E(){return(E=(0,p.default)(i.mark(function t(e){var n,a,r;return i.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.Component,a=e.ctx,t.next=3,(0,f.loadGetInitialProps)(n,a);case 3:return r=t.sent,t.abrupt("return",{pageProps:r});case 5:case"end":return t.stop()}},t)}))).apply(this,arguments)}e.AppInitialProps=f.AppInitialProps;var _=function(t){function e(){return a(this,e),u(this,o(e).apply(this,arguments))}return s(e,t),r(e,[{key:"componentDidCatch",value:function(t,e){throw t}},{key:"render",value:function(){var t=this.props,e=t.router,n=t.Component,a=t.pageProps,r=v(e);return d.default.createElement(n,(0,l.default)({},a,{url:r}))}}]),e}(d.default.Component);function v(t){var e=t.pathname,n=t.asPath,a=t.query;return{get query(){return a},get pathname(){return e},get asPath(){return n},back:function(){t.back()},push:function(e,n){return t.push(e,n)},pushTo:function(e,n){var a=n?e:"",r=n||e;return t.push(a,r)},replace:function(e,n){return t.replace(e,n)},replaceTo:function(e,n){var a=n?e:"",r=n||e;return t.replace(a,r)}}}e.default=_,_.origGetInitialProps=h,_.getInitialProps=h},GcxT:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("1TCz")}])},Wl4k:function(t,e){t.exports={unregister:function(){"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},register:function(t){"serviceWorker"in navigator&&navigator.serviceWorker.register(t||"/service-worker.js").then(function(t){console.log("SW registered: ",t)}).catch(function(t){console.log("SW registration failed: ",t)})}}}},[["GcxT",0,1]]]);