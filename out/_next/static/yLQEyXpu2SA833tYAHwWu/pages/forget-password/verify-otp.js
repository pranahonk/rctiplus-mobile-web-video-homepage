(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"6CmU":function(t,e,n){n("LzdP"),t.exports=n("WEpk").Date.now},"7sx5":function(t,e,n){"use strict";var r=n("q1tI"),a=n.n(r),o=n("17x9"),i=n.n(o);var s="styles_react-code-input-container__tpiKG",c="styles_react-code-input__CRulA",u="styles_loading__Z65VQ",l="styles_blur__19vMK",f="styles_title__1cca0",p="styles_spin__6y_8G";!function(t,e){void 0===e&&(e={});var n=e.insertAt;if(t&&"undefined"!==typeof document){var r=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===n&&r.firstChild?r.insertBefore(a,r.firstChild):r.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}}("/* add css styles here (optional) */\n\n.styles_react-code-input-container__tpiKG {\n  position: relative;\n}\n\n.styles_react-code-input__CRulA > input {\n  border: solid 1px #a8adb7;\n  border-right: none;\n  font-family: 'Lato';\n  font-size: 20px;\n  color: #525461;\n  text-align: center;\n  box-sizing: border-box;\n  border-radius: 0;\n  -webkit-appearance: initial;\n}\n\n.styles_react-code-input__CRulA > input:last-child {\n  border-right: solid 1px #a8adb7;\n  border-top-right-radius: 6px;\n  border-bottom-right-radius: 6px;\n}\n\n.styles_react-code-input__CRulA > input:first-child {\n  border-top-left-radius: 6px;\n  border-bottom-left-radius: 6px;\n}\n\n.styles_react-code-input__CRulA > input:focus {\n  outline: none;\n  border: 1px solid #006fff;\n  caret-color: #006fff;\n}\n\n.styles_react-code-input__CRulA > input:focus + input {\n  border-left: none;\n}\n\n.styles_loading__Z65VQ {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  text-align: center;\n}\n\n.styles_blur__19vMK {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #fff;\n  opacity: 0.5;\n  filter: blur(0.5px);\n  transition: opacity 0.3s;\n}\n\n.styles_title__1cca0 {\n  margin: 0;\n  height: 20px;\n  padding-bottom: 10px;\n}\n\n.styles_spin__6y_8G {\n  display: inline-block;\n  animation: styles_loadingCircle__293ky 1s infinite linear;\n}\n\n@keyframes styles_loadingCircle__293ky {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n");var d=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},h=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),v=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==typeof e&&"function"!==typeof e?t:e},b=8,y=37,m=38,_=39,g=40,w=function(t){function e(t){d(this,e);var n=v(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));j.call(n);var r=t.fields,o=t.values,i=void 0,s=0;if(o&&o.length){i=[];for(var c=0;c<r;c++)i.push(o[c]||"");s=o.length>=r?0:o.length}else i=Array(r).fill("");n.state={values:i,autoFocusIndex:s},n.iRefs=[];for(var u=0;u<r;u++)n.iRefs.push(a.a.createRef());return n.id=+new Date,n}return function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,r["Component"]),h(e,[{key:"render",value:function(){var t=this,e=this.state,n=e.values,r=e.autoFocusIndex,o=this.props,i=o.loading,d=o.title,h=o.fieldHeight,v=o.fieldWidth,b=o.fields,y=o.autoFocus,m=o.className,_=o.type,g={width:v,height:h},w={width:b*v},j={lineHeight:h+"px"};return a.a.createElement("div",{className:s+" "+m,style:w},d&&a.a.createElement("p",{className:f},d),a.a.createElement("div",{className:c},n.map(function(e,n){return a.a.createElement("input",{type:"number"===_?"tel":_,pattern:"number"===_?"[0-9]":null,autoFocus:y&&n===r,style:g,key:t.id+"-"+n,"data-id":n,value:e,ref:t.iRefs[n],onChange:t.onChange,onKeyDown:t.onKeyDown,onFocus:t.onFocus})})),i&&a.a.createElement("div",{className:u,style:j},a.a.createElement("div",{className:l}),a.a.createElement("svg",{className:p,viewBox:"0 0 1024 1024","data-icon":"loading",width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},a.a.createElement("path",{fill:"#006fff",d:"M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"}))))}}]),e}();w.propTypes={type:i.a.oneOf(["text","number"]),onChange:i.a.func,onComplete:i.a.func,fields:i.a.number,loading:i.a.bool,title:i.a.string,fieldWidth:i.a.number,fieldHeight:i.a.number,autoFocus:i.a.bool,className:i.a.string,values:i.a.arrayOf(i.a.string)},w.defaultProps={type:"number",fields:6,fieldWidth:58,fieldHeight:54,autoFocus:!0};var j=function(){var t=this;this.__clearvalues__=function(){var e=t.props.fields;t.setState({values:Array(e).fill("")}),t.iRefs[0].current.focus()},this.triggerChange=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.state.values,n=t.props,r=n.onChange,a=n.onComplete,o=n.fields,i=e.join("");r&&r(i),a&&i.length>=o&&a(i)},this.onChange=function(e){var n=parseInt(e.target.dataset.id);if("number"===t.props.type&&(e.target.value=e.target.value.replace(/[^\d]/gi,"")),""!==e.target.value&&("number"!==t.props.type||e.target.validity.valid)){var r=t.props.fields,a=void 0,o=e.target.value,i=t.state.values;if(i=Object.assign([],i),o.length>1){var s=o.length+n-1;s>=r&&(s=r-1),a=t.iRefs[s],o.split("").forEach(function(t,e){var a=n+e;a<r&&(i[a]=t)}),t.setState({values:i})}else a=t.iRefs[n+1],i[n]=o,t.setState({values:i});a&&(a.current.focus(),a.current.select()),t.triggerChange(i)}},this.onKeyDown=function(e){var n=parseInt(e.target.dataset.id),r=n-1,a=n+1,o=t.iRefs[r],i=t.iRefs[a];switch(e.keyCode){case b:e.preventDefault();var s=[].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}(t.state.values));t.state.values[n]?(s[n]="",t.setState({values:s}),t.triggerChange(s)):o&&(s[r]="",o.current.focus(),t.setState({values:s}),t.triggerChange(s));break;case y:e.preventDefault(),o&&o.current.focus();break;case _:e.preventDefault(),i&&i.current.focus();break;case m:case g:e.preventDefault()}},this.onFocus=function(t){t.target.select(t)}};e.a=w},Cg2A:function(t,e,n){t.exports=n("6CmU")},GVoN:function(t,e,n){"use strict";var r=n("ln6h"),a=n.n(r),o=n("O40h"),i=n("eVuF"),s=n.n(i),c=n("vDqi"),u=n.n(c),l=n("obyI"),f=n("cph9"),p=u.a.create({baseURL:l.c+"/api",headers:{Authorization:l.g}});e.a={register:function(t){var e=t.username,n=t.password,r=t.fullname,i=t.gender,c=t.dob,u=t.otp,l=t.device_id;return function(t){return new s.a(function(){var s=Object(o.a)(a.a.mark(function o(s,d){var h;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,p.post("/v2/register",{password:n,username:e,fullname:r,gender:i,dob:c,otp:u,device_id:l},{headers:{"Content-Type":"application/json"}});case 3:0===(h=a.sent).data.status.code?(Object(f.c)("ACCESS_TOKEN",h.data.data.access_token),t({type:"REGISTER",data:h.data.data,meta:h.data.meta}),s(h)):d(h),a.next=10;break;case 7:a.prev=7,a.t0=a.catch(0),d(a.t0);case 10:case"end":return a.stop()}},o,null,[[0,7]])}));return function(t,e){return s.apply(this,arguments)}}())}},resendVerifyEmail:function(t){return function(e){return new s.a(function(){var n=Object(o.a)(a.a.mark(function n(r,o){var i;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,p.post("/v1/resend-verify-email",{emailphone:t},{headers:{"Content-Type":"application/json"}});case 3:0===(i=n.sent).data.status.code?(e({type:"RESEND_VERIFY_EMAIL",data:i.data.data,meta:i.data.meta}),r(i)):o(i),n.next=10;break;case 7:n.prev=7,n.t0=n.catch(0),o(n.t0);case 10:case"end":return n.stop()}},n,null,[[0,7]])}));return function(t,e){return n.apply(this,arguments)}}())}},getPhoneOtp:function(t){return function(e){return new s.a(function(){var n=Object(o.a)(a.a.mark(function n(r,o){var i;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,p.get("/v1/otp?phonenumber=".concat(t));case 3:0===(i=n.sent).data.status.code?(e({type:"GET_OTP"}),r(i)):o(i),n.next=10;break;case 7:n.prev=7,n.t0=n.catch(0),o(n.t0);case 10:case"end":return n.stop()}},n,null,[[0,7]])}));return function(t,e){return n.apply(this,arguments)}}())}},getOtp:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"registration";return function(n){return new s.a(function(){var r=Object(o.a)(a.a.mark(function r(o,i){var s;return a.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,p.post("/v2/otp",{username:t,type:e},{headers:{"Content-Type":"application/json"}});case 3:0===(s=r.sent).data.status.code&&n({type:"GET_OTP"}),o(s),r.next=11;break;case 8:r.prev=8,r.t0=r.catch(0),i(r.t0);case 11:case"end":return r.stop()}},r,null,[[0,8]])}));return function(t,e){return r.apply(this,arguments)}}())}},verifyOtp:function(t,e){return function(n){return new s.a(function(){var r=Object(o.a)(a.a.mark(function r(o,i){var s;return a.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,p.post("/v2/verify-otp",{username:t,otp:e},{headers:{"Content-Type":"application/json"}});case 3:0===(s=r.sent).data.status.code&&n({type:"VERIFY_OTP"}),o(s),r.next=11;break;case 8:r.prev=8,r.t0=r.catch(0),i(r.t0);case 11:case"end":return r.stop()}},r,null,[[0,8]])}));return function(t,e){return r.apply(this,arguments)}}())}},forgotPassword:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"mweb";return function(r){return new s.a(function(){var i=Object(o.a)(a.a.mark(function o(i,s){var c;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,p.post("/v1/forgot-password",{emailphone:t,device_id:e,platform:n},{headers:{"Content-Type":"application/json"}});case 3:0===(c=a.sent).data.status.code?(r({type:"FORGOT_PASSWORD",status:c.data.status}),i(c)):s(c),a.next=10;break;case 7:a.prev=7,a.t0=a.catch(0),s(a.t0);case 10:case"end":return a.stop()}},o,null,[[0,7]])}));return function(t,e){return i.apply(this,arguments)}}())}},createNewPassword:function(t,e,n,r){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"mweb";return function(c){return new s.a(function(){var s=Object(o.a)(a.a.mark(function o(s,u){var l;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,p.post("/v1/new-pass",{token:t,otp:e,device_id:n,platform:i,newpass:r},{headers:{"Content-Type":"application/json"}});case 3:0===(l=a.sent).data.status.code?(c({type:"CREATE_NEW_PASSWORD",status:l.data.status}),s(l)):u(l),a.next=10;break;case 7:a.prev=7,a.t0=a.catch(0),u(a.t0);case 10:case"end":return a.stop()}},o,null,[[0,7]])}));return function(t,e){return s.apply(this,arguments)}}())}},createForgotPassword:function(t,e,n){return function(r){return new s.a(function(){var i=Object(o.a)(a.a.mark(function o(i,s){var c;return a.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,p.post("/v2/forgot-password",{username:t,new_password:e,otp:n});case 3:0===(c=a.sent).data.status.code?(r({type:"CREATE_NEW_PASSWORD",status:c.data.status}),i(c)):s(c),a.next=10;break;case 7:a.prev=7,a.t0=a.catch(0),s(a.t0);case 10:case"end":return a.stop()}},o,null,[[0,7]])}));return function(t,e){return i.apply(this,arguments)}}())}},setUsername:function(t){return function(e){return e({type:"USERNAME",username:t})}},setPassword:function(t){return function(e){return e({type:"PASSWORD",password:t})}},setFullname:function(t){return function(e){return e({type:"FULLNAME",fullname:t})}},setGender:function(t){return function(e){return e({type:"GENDER",gender:t})}},setDob:function(t){return function(e){return e({type:"DOB",dob:t})}},setUsernameType:function(t){return function(e){return e({type:"USERNAME_TYPE",username_type:t})}},setOtp:function(t){return function(e){return e({type:"OTP",otp:t})}}}},LzdP:function(t,e,n){var r=n("Y7ZC");r(r.S,"Date",{now:function(){return(new Date).getTime()}})},OEHZ:function(t,e,n){"use strict";n.r(e);var r=n("Cg2A"),a=n.n(r),o=n("0iUn"),i=n("sLSF"),s=n("MI3g"),c=n("a7VT"),u=n("Tit0"),l=n("q1tI"),f=n.n(l),p=n("nOHt"),d=n.n(p),h=n("/MKj"),v=n("7sx5"),b=n("QhPV"),y=n("GVoN"),m=n("IF/j"),_=n("Ywvz"),g=n("zeFo"),w=n("uBiN"),j=n("jrRI"),O=n("sOKU"),k=(n("Rtfv"),f.a.createElement),T=function(t){function e(t){var n;return Object(o.a)(this,e),(n=Object(s.a)(this,Object(c.a)(e).call(this,t))).state={username:"",alert_message:"Carefully check your Email for verification code. You only have 3 attempts",otp:"",interval:60,countdown_key:0,current_time:a()()},n}return Object(u.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;this.setState({username:this.props.registration.username},function(){t.props.getOtp(t.state.username)})}},{key:"submitOtp",value:function(t){t.preventDefault(),d.a.push("/forget-password/change-password")}},{key:"onChangeOtp",value:function(t){var e=this;this.setState({otp:t},function(){e.props.setOtp(e.state.otp)})}},{key:"showAlert",value:function(){var t=this,e=this.state.username;Object(m.b)(this.state.alert_message,"OTP Limits",function(){t.props.getOtp(e).then(function(e){200===e.status&&(a()(),t.state.countdown_key)}).catch(function(t){})},!0,"Not Now","Request New OTP")}},{key:"render",value:function(){var t=this,e="Verification code was sent to your email",n=this.state.username||"";if("PHONE_NUMBER"===this.props.registration.username_type){e="Verification code was sent via SMS to your phone number";for(var r="",a=2;a<n.length;a++)r+=n[a],4!=a&&8!=a||(r+=" ");n="+62 "+r}return k(_.a,{title:"Verify OTP"},k(g.a,{title:"Verify OTP"}),k("div",{className:"container-box"},k("p",null,"Verify your account, enter your code below"),k("p",{style:{fontSize:14},className:"text-default-rcti"},e," ",k("span",{style:{color:"white"}},n)),k(w.a,{onSubmit:this.submitOtp.bind(this)},k(j.a,null,k(v.a,{fields:4,onChange:this.onChangeOtp.bind(this),className:"otp-input"})),k(j.a,null,k("label",{className:"lbl_rsndcode"},"Resend code ",k(b.a,{key:this.state.countdown_key,date:this.state.current_time+1e3*this.state.interval,renderer:function(e){e.hours;var n=e.minutes,r=e.seconds;return e.completed?k("p",{className:"text-default-rcti",style:{fontSize:12,textAlign:"center"}},k("span",{onClick:function(){return d.a.push("/forget-password")},className:"el-red"},"Change ","PHONE_NUMBER"===t.props.registration.username_type?"Phone Number":"Email")," or ",k("span",{onClick:t.showAlert.bind(t),className:"el-red"},"Resend Code")):k("span",null,Object(b.b)(n),":",k("span",{className:"time-resendcode"},Object(b.b)(r)))}}))),k(j.a,{className:"btn-next-position"},k(O.a,{className:"btn-next block-btn"},"Verify")))))}}]),e}(f.a.Component);e.default=Object(h.b)(function(t){return t},y.a)(T)},PJCl:function(t,e,n){"use strict";var r=n("TqRt");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=r(n("q1tI")),o=(0,r(n("8/g6")).default)(a.default.createElement("path",{d:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"}),"ArrowBack");e.default=o},QhPV:function(t,e,n){"use strict";n.d(e,"b",function(){return p});var r=n("q1tI"),a=n.n(r),o=n("17x9"),i=n.n(o);function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t,e){return!e||"object"!==typeof e&&"function"!==typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function f(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function p(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=String(t);if(0===e)return n;var r=n.match(/(.*?)([0-9]+)(.*)/),a=r?r[1]:"",o=r?r[3]:"",i=r?r[2]:n,s=i.length>=e?i:(f(Array(e)).map(function(){return"0"}).join("")+i).slice(-1*e);return"".concat(a).concat(s).concat(o)}var d={daysInHours:!1,zeroPadTime:2};function h(t,e){var n=t.days,r=t.hours,a=t.minutes,o=t.seconds,i=Object.assign(Object.assign({},d),e),s=i.daysInHours,c=i.zeroPadTime,u=i.zeroPadDays,l=void 0===u?c:u,f=s?p(r+24*n,c):p(r,Math.min(2,c));return{days:s?"":p(n,l),hours:f,minutes:p(a,Math.min(2,c)),seconds:p(o,Math.min(2,c))}}var v=n("XaGS"),b=function(t){function e(t){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=l(this,c(e).call(this,t))).mounted=!1,n.tick=function(){var t=n.props.onTick,e=n.calcTimeDelta();n.setTimeDeltaState(Object.assign({},e)),t&&e.total>0&&t(e)},n.start=function(){n.setState(function(t){var e=t.offsetStart;return{offsetStart:0,offsetTime:t.offsetTime+(e?Date.now()-e:0)}},function(){var t=n.calcTimeDelta();n.setTimeDeltaState(t),n.props.onStart&&n.props.onStart(t),n.props.controlled||(n.clearInterval(),n.interval=window.setInterval(n.tick,n.props.intervalDelay))})},n.pause=function(){n.clearInterval(),n.setState({offsetStart:n.calcOffsetStart()},function(){var t=n.calcTimeDelta();n.setTimeDeltaState(t),n.props.onPause&&n.props.onPause(t)})},n.isPaused=function(){return n.state.offsetStart>0},n.isCompleted=function(){return n.state.timeDelta.completed},n.state={timeDelta:n.calcTimeDelta(),offsetStart:t.autoStart?0:n.calcOffsetStart(),offsetTime:0},n}var n,r,o;return function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a.a.Component),n=e,(r=[{key:"componentDidMount",value:function(){this.mounted=!0,this.props.autoStart&&this.start(),this.props.onMount&&this.props.onMount(this.calcTimeDelta())}},{key:"componentDidUpdate",value:function(t){v(this.props,t)||this.setTimeDeltaState(this.calcTimeDelta())}},{key:"componentWillUnmount",value:function(){this.mounted=!1,this.clearInterval()}},{key:"calcTimeDelta",value:function(){var t=this.props;return function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.now,a=void 0===r?Date.now:r,o=n.precision,i=void 0===o?0:o,s=n.controlled,c=void 0!==s&&s,u=n.offsetTime,l=void 0===u?0:u;e="string"===typeof t?new Date(t).getTime():t instanceof Date?t.getTime():t,c||(e+=l);var f=Math.round(1e3*parseFloat((Math.max(0,c?e:e-a())/1e3).toFixed(Math.max(0,Math.min(20,i))))),p=f/1e3;return{total:f,days:Math.floor(p/86400),hours:Math.floor(p/3600%24),minutes:Math.floor(p/60%60),seconds:Math.floor(p%60),milliseconds:Number((p%1*1e3).toFixed()),completed:f<=0}}(t.date,{now:t.now,precision:t.precision,controlled:t.controlled,offsetTime:this.state?this.state.offsetTime:0})}},{key:"calcOffsetStart",value:function(){return Date.now()}},{key:"clearInterval",value:function(){window.clearInterval(this.interval)}},{key:"setTimeDeltaState",value:function(t){var e,n=this;if(!this.state.timeDelta.completed&&t.completed&&(this.clearInterval(),e=function(){return n.props.onComplete&&n.props.onComplete(t)}),this.mounted)return this.setState({timeDelta:t},e)}},{key:"getApi",value:function(){return this.api=this.api||{start:this.start,pause:this.pause,isPaused:this.isPaused,isCompleted:this.isCompleted}}},{key:"getRenderProps",value:function(){var t=this.props,e=t.daysInHours,n=t.zeroPadTime,r=t.zeroPadDays,a=this.state.timeDelta;return Object.assign(Object.assign({},a),{api:this.getApi(),props:this.props,formatted:h(a,{daysInHours:e,zeroPadTime:n,zeroPadDays:r})})}},{key:"render",value:function(){var t=this.props,e=t.children,n=t.renderer,r=this.getRenderProps();if(n)return n(r);if(e&&this.state.timeDelta.completed)return a.a.cloneElement(e,{countdown:r});var o=r.formatted,i=o.days,s=o.hours,c=o.minutes,u=o.seconds;return a.a.createElement("span",null,i,i?":":"",s,":",c,":",u)}}])&&s(n.prototype,r),o&&s(n,o),e}();b.defaultProps=Object.assign(Object.assign({},d),{controlled:!1,intervalDelay:1e3,precision:0,autoStart:!0}),b.propTypes={date:i.a.oneOfType([i.a.instanceOf(Date),i.a.string,i.a.number]).isRequired,daysInHours:i.a.bool,zeroPadTime:i.a.number,zeroPadDays:i.a.number,controlled:i.a.bool,intervalDelay:i.a.number,precision:i.a.number,autoStart:i.a.bool,children:i.a.element,renderer:i.a.func,now:i.a.func,onMount:i.a.func,onStart:i.a.func,onPause:i.a.func,onTick:i.a.func,onComplete:i.a.func},e.a=b},XaGS:function(t,e,n){(function(t,n){var r=200,a="__lodash_hash_undefined__",o=1,i=2,s=9007199254740991,c="[object Arguments]",u="[object Array]",l="[object AsyncFunction]",f="[object Boolean]",p="[object Date]",d="[object Error]",h="[object Function]",v="[object GeneratorFunction]",b="[object Map]",y="[object Number]",m="[object Null]",_="[object Object]",g="[object Proxy]",w="[object RegExp]",j="[object Set]",O="[object String]",k="[object Symbol]",T="[object Undefined]",x="[object ArrayBuffer]",C="[object DataView]",S=/^\[object .+?Constructor\]$/,E=/^(?:0|[1-9]\d*)$/,P={};P["[object Float32Array]"]=P["[object Float64Array]"]=P["[object Int8Array]"]=P["[object Int16Array]"]=P["[object Int32Array]"]=P["[object Uint8Array]"]=P["[object Uint8ClampedArray]"]=P["[object Uint16Array]"]=P["[object Uint32Array]"]=!0,P[c]=P[u]=P[x]=P[f]=P[C]=P[p]=P[d]=P[h]=P[b]=P[y]=P[_]=P[w]=P[j]=P[O]=P["[object WeakMap]"]=!1;var N="object"==typeof t&&t&&t.Object===Object&&t,A="object"==typeof self&&self&&self.Object===Object&&self,D=N||A||Function("return this")(),R=e&&!e.nodeType&&e,z=R&&"object"==typeof n&&n&&!n.nodeType&&n,M=z&&z.exports===R,I=M&&N.process,F=function(){try{return I&&I.binding&&I.binding("util")}catch(t){}}(),V=F&&F.isTypedArray;function U(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}function L(t){var e=-1,n=Array(t.size);return t.forEach(function(t,r){n[++e]=[r,t]}),n}function H(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t}),n}var B,W,G=Array.prototype,q=Function.prototype,K=Object.prototype,Y=D["__core-js_shared__"],J=q.toString,Q=K.hasOwnProperty,$=function(){var t=/[^.]+$/.exec(Y&&Y.keys&&Y.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),X=K.toString,Z=RegExp("^"+J.call(Q).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),tt=M?D.Buffer:void 0,et=D.Symbol,nt=D.Uint8Array,rt=K.propertyIsEnumerable,at=G.splice,ot=et?et.toStringTag:void 0,it=Object.getOwnPropertySymbols,st=tt?tt.isBuffer:void 0,ct=(B=Object.keys,W=Object,function(t){return B(W(t))}),ut=It(D,"DataView"),lt=It(D,"Map"),ft=It(D,"Promise"),pt=It(D,"Set"),dt=It(D,"WeakMap"),ht=It(Object,"create"),vt=Lt(ut),bt=Lt(lt),yt=Lt(ft),mt=Lt(pt),_t=Lt(dt),gt=et?et.prototype:void 0,wt=gt?gt.valueOf:void 0;function jt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Ot(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function kt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Tt(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new kt;++e<n;)this.add(t[e])}function xt(t){var e=this.__data__=new Ot(t);this.size=e.size}function Ct(t,e){var n=Wt(t),r=!n&&Bt(t),a=!n&&!r&&Gt(t),o=!n&&!r&&!a&&Qt(t),i=n||r||a||o,s=i?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],c=s.length;for(var u in t)!e&&!Q.call(t,u)||i&&("length"==u||a&&("offset"==u||"parent"==u)||o&&("buffer"==u||"byteLength"==u||"byteOffset"==u)||Ut(u,c))||s.push(u);return s}function St(t,e){for(var n=t.length;n--;)if(Ht(t[n][0],e))return n;return-1}function Et(t){return null==t?void 0===t?T:m:ot&&ot in Object(t)?function(t){var e=Q.call(t,ot),n=t[ot];try{t[ot]=void 0;var r=!0}catch(o){}var a=X.call(t);r&&(e?t[ot]=n:delete t[ot]);return a}(t):function(t){return X.call(t)}(t)}function Pt(t){return Jt(t)&&Et(t)==c}function Nt(t,e,n,r,a){return t===e||(null==t||null==e||!Jt(t)&&!Jt(e)?t!==t&&e!==e:function(t,e,n,r,a,s){var l=Wt(t),h=Wt(e),v=l?u:Vt(t),m=h?u:Vt(e),g=(v=v==c?_:v)==_,T=(m=m==c?_:m)==_,S=v==m;if(S&&Gt(t)){if(!Gt(e))return!1;l=!0,g=!1}if(S&&!g)return s||(s=new xt),l||Qt(t)?Rt(t,e,n,r,a,s):function(t,e,n,r,a,s,c){switch(n){case C:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case x:return!(t.byteLength!=e.byteLength||!s(new nt(t),new nt(e)));case f:case p:case y:return Ht(+t,+e);case d:return t.name==e.name&&t.message==e.message;case w:case O:return t==e+"";case b:var u=L;case j:var l=r&o;if(u||(u=H),t.size!=e.size&&!l)return!1;var h=c.get(t);if(h)return h==e;r|=i,c.set(t,e);var v=Rt(u(t),u(e),r,a,s,c);return c.delete(t),v;case k:if(wt)return wt.call(t)==wt.call(e)}return!1}(t,e,v,n,r,a,s);if(!(n&o)){var E=g&&Q.call(t,"__wrapped__"),P=T&&Q.call(e,"__wrapped__");if(E||P){var N=E?t.value():t,A=P?e.value():e;return s||(s=new xt),a(N,A,n,r,s)}}if(!S)return!1;return s||(s=new xt),function(t,e,n,r,a,i){var s=n&o,c=zt(t),u=c.length,l=zt(e).length;if(u!=l&&!s)return!1;for(var f=u;f--;){var p=c[f];if(!(s?p in e:Q.call(e,p)))return!1}var d=i.get(t);if(d&&i.get(e))return d==e;var h=!0;i.set(t,e),i.set(e,t);for(var v=s;++f<u;){p=c[f];var b=t[p],y=e[p];if(r)var m=s?r(y,b,p,e,t,i):r(b,y,p,t,e,i);if(!(void 0===m?b===y||a(b,y,n,r,i):m)){h=!1;break}v||(v="constructor"==p)}if(h&&!v){var _=t.constructor,g=e.constructor;_!=g&&"constructor"in t&&"constructor"in e&&!("function"==typeof _&&_ instanceof _&&"function"==typeof g&&g instanceof g)&&(h=!1)}return i.delete(t),i.delete(e),h}(t,e,n,r,a,s)}(t,e,n,r,Nt,a))}function At(t){return!(!Yt(t)||function(t){return!!$&&$ in t}(t))&&(qt(t)?Z:S).test(Lt(t))}function Dt(t){if(!function(t){var e=t&&t.constructor,n="function"==typeof e&&e.prototype||K;return t===n}(t))return ct(t);var e=[];for(var n in Object(t))Q.call(t,n)&&"constructor"!=n&&e.push(n);return e}function Rt(t,e,n,r,a,s){var c=n&o,u=t.length,l=e.length;if(u!=l&&!(c&&l>u))return!1;var f=s.get(t);if(f&&s.get(e))return f==e;var p=-1,d=!0,h=n&i?new Tt:void 0;for(s.set(t,e),s.set(e,t);++p<u;){var v=t[p],b=e[p];if(r)var y=c?r(b,v,p,e,t,s):r(v,b,p,t,e,s);if(void 0!==y){if(y)continue;d=!1;break}if(h){if(!U(e,function(t,e){if(o=e,!h.has(o)&&(v===t||a(v,t,n,r,s)))return h.push(e);var o})){d=!1;break}}else if(v!==b&&!a(v,b,n,r,s)){d=!1;break}}return s.delete(t),s.delete(e),d}function zt(t){return function(t,e,n){var r=e(t);return Wt(t)?r:function(t,e){for(var n=-1,r=e.length,a=t.length;++n<r;)t[a+n]=e[n];return t}(r,n(t))}(t,$t,Ft)}function Mt(t,e){var n=t.__data__;return function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}(e)?n["string"==typeof e?"string":"hash"]:n.map}function It(t,e){var n=function(t,e){return null==t?void 0:t[e]}(t,e);return At(n)?n:void 0}jt.prototype.clear=function(){this.__data__=ht?ht(null):{},this.size=0},jt.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},jt.prototype.get=function(t){var e=this.__data__;if(ht){var n=e[t];return n===a?void 0:n}return Q.call(e,t)?e[t]:void 0},jt.prototype.has=function(t){var e=this.__data__;return ht?void 0!==e[t]:Q.call(e,t)},jt.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=ht&&void 0===e?a:e,this},Ot.prototype.clear=function(){this.__data__=[],this.size=0},Ot.prototype.delete=function(t){var e=this.__data__,n=St(e,t);return!(n<0)&&(n==e.length-1?e.pop():at.call(e,n,1),--this.size,!0)},Ot.prototype.get=function(t){var e=this.__data__,n=St(e,t);return n<0?void 0:e[n][1]},Ot.prototype.has=function(t){return St(this.__data__,t)>-1},Ot.prototype.set=function(t,e){var n=this.__data__,r=St(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},kt.prototype.clear=function(){this.size=0,this.__data__={hash:new jt,map:new(lt||Ot),string:new jt}},kt.prototype.delete=function(t){var e=Mt(this,t).delete(t);return this.size-=e?1:0,e},kt.prototype.get=function(t){return Mt(this,t).get(t)},kt.prototype.has=function(t){return Mt(this,t).has(t)},kt.prototype.set=function(t,e){var n=Mt(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},Tt.prototype.add=Tt.prototype.push=function(t){return this.__data__.set(t,a),this},Tt.prototype.has=function(t){return this.__data__.has(t)},xt.prototype.clear=function(){this.__data__=new Ot,this.size=0},xt.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},xt.prototype.get=function(t){return this.__data__.get(t)},xt.prototype.has=function(t){return this.__data__.has(t)},xt.prototype.set=function(t,e){var n=this.__data__;if(n instanceof Ot){var a=n.__data__;if(!lt||a.length<r-1)return a.push([t,e]),this.size=++n.size,this;n=this.__data__=new kt(a)}return n.set(t,e),this.size=n.size,this};var Ft=it?function(t){return null==t?[]:(t=Object(t),function(t,e){for(var n=-1,r=null==t?0:t.length,a=0,o=[];++n<r;){var i=t[n];e(i,n,t)&&(o[a++]=i)}return o}(it(t),function(e){return rt.call(t,e)}))}:function(){return[]},Vt=Et;function Ut(t,e){return!!(e=null==e?s:e)&&("number"==typeof t||E.test(t))&&t>-1&&t%1==0&&t<e}function Lt(t){if(null!=t){try{return J.call(t)}catch(e){}try{return t+""}catch(e){}}return""}function Ht(t,e){return t===e||t!==t&&e!==e}(ut&&Vt(new ut(new ArrayBuffer(1)))!=C||lt&&Vt(new lt)!=b||ft&&"[object Promise]"!=Vt(ft.resolve())||pt&&Vt(new pt)!=j||dt&&"[object WeakMap]"!=Vt(new dt))&&(Vt=function(t){var e=Et(t),n=e==_?t.constructor:void 0,r=n?Lt(n):"";if(r)switch(r){case vt:return C;case bt:return b;case yt:return"[object Promise]";case mt:return j;case _t:return"[object WeakMap]"}return e});var Bt=Pt(function(){return arguments}())?Pt:function(t){return Jt(t)&&Q.call(t,"callee")&&!rt.call(t,"callee")},Wt=Array.isArray;var Gt=st||function(){return!1};function qt(t){if(!Yt(t))return!1;var e=Et(t);return e==h||e==v||e==l||e==g}function Kt(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=s}function Yt(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function Jt(t){return null!=t&&"object"==typeof t}var Qt=V?function(t){return function(e){return t(e)}}(V):function(t){return Jt(t)&&Kt(t.length)&&!!P[Et(t)]};function $t(t){return null!=(e=t)&&Kt(e.length)&&!qt(e)?Ct(t):Dt(t);var e}n.exports=function(t,e){return Nt(t,e)}}).call(this,n("yLpj"),n("YuTi")(t))},jrRI:function(t,e,n){"use strict";var r=n("wx14"),a=n("zLVn"),o=n("q1tI"),i=n.n(o),s=n("17x9"),c=n.n(s),u=n("TSYQ"),l=n.n(u),f=n("33Jr"),p={children:c.a.node,row:c.a.bool,check:c.a.bool,inline:c.a.bool,disabled:c.a.bool,tag:f.l,className:c.a.string,cssModule:c.a.object},d=function(t){var e=t.className,n=t.cssModule,o=t.row,s=t.disabled,c=t.check,u=t.inline,p=t.tag,d=Object(a.a)(t,["className","cssModule","row","disabled","check","inline","tag"]),h=Object(f.h)(l()(e,!!o&&"row",c?"form-check":"form-group",!(!c||!u)&&"form-check-inline",!(!c||!s)&&"disabled"),n);return i.a.createElement(p,Object(r.a)({},d,{className:h}))};d.propTypes=p,d.defaultProps={tag:"div"},e.a=d},sOKU:function(t,e,n){"use strict";var r=n("wx14"),a=n("zLVn"),o=n("dI71"),i=n("JX7q"),s=n("q1tI"),c=n.n(s),u=n("17x9"),l=n.n(u),f=n("TSYQ"),p=n.n(f),d=n("33Jr"),h={active:l.a.bool,"aria-label":l.a.string,block:l.a.bool,color:l.a.string,disabled:l.a.bool,outline:l.a.bool,tag:d.l,innerRef:l.a.oneOfType([l.a.object,l.a.func,l.a.string]),onClick:l.a.func,size:l.a.string,children:l.a.node,className:l.a.string,cssModule:l.a.object,close:l.a.bool},v=function(t){function e(e){var n;return(n=t.call(this,e)||this).onClick=n.onClick.bind(Object(i.a)(Object(i.a)(n))),n}Object(o.a)(e,t);var n=e.prototype;return n.onClick=function(t){this.props.disabled?t.preventDefault():this.props.onClick&&this.props.onClick(t)},n.render=function(){var t=this.props,e=t.active,n=t["aria-label"],o=t.block,i=t.className,s=t.close,u=t.cssModule,l=t.color,f=t.outline,h=t.size,v=t.tag,b=t.innerRef,y=Object(a.a)(t,["active","aria-label","block","className","close","cssModule","color","outline","size","tag","innerRef"]);s&&"undefined"===typeof y.children&&(y.children=c.a.createElement("span",{"aria-hidden":!0},"\xd7"));var m="btn"+(f?"-outline":"")+"-"+l,_=Object(d.h)(p()(i,{close:s},s||"btn",s||m,!!h&&"btn-"+h,!!o&&"btn-block",{active:e,disabled:this.props.disabled}),u);y.href&&"button"===v&&(v="a");var g=s?"Close":null;return c.a.createElement(v,Object(r.a)({type:"button"===v&&y.onClick?"button":void 0},y,{className:_,ref:b,onClick:this.onClick,"aria-label":n||g}))},e}(c.a.Component);v.propTypes=h,v.defaultProps={color:"secondary",tag:"button"},e.a=v},uBiN:function(t,e,n){"use strict";var r=n("wx14"),a=n("zLVn"),o=n("dI71"),i=n("JX7q"),s=n("q1tI"),c=n.n(s),u=n("17x9"),l=n.n(u),f=n("TSYQ"),p=n.n(f),d=n("33Jr"),h={children:l.a.node,inline:l.a.bool,tag:d.l,innerRef:l.a.oneOfType([l.a.object,l.a.func,l.a.string]),className:l.a.string,cssModule:l.a.object},v=function(t){function e(e){var n;return(n=t.call(this,e)||this).getRef=n.getRef.bind(Object(i.a)(Object(i.a)(n))),n.submit=n.submit.bind(Object(i.a)(Object(i.a)(n))),n}Object(o.a)(e,t);var n=e.prototype;return n.getRef=function(t){this.props.innerRef&&this.props.innerRef(t),this.ref=t},n.submit=function(){this.ref&&this.ref.submit()},n.render=function(){var t=this.props,e=t.className,n=t.cssModule,o=t.inline,i=t.tag,s=t.innerRef,u=Object(a.a)(t,["className","cssModule","inline","tag","innerRef"]),l=Object(d.h)(p()(e,!!o&&"form-inline"),n);return c.a.createElement(i,Object(r.a)({},u,{ref:s,className:l}))},e}(s.Component);v.propTypes=h,v.defaultProps={tag:"form"},e.a=v},xTBg:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/forget-password/verify-otp",function(){return n("OEHZ")}])},zeFo:function(t,e,n){"use strict";var r=n("0iUn"),a=n("sLSF"),o=n("MI3g"),i=n("a7VT"),s=n("Tit0"),c=n("q1tI"),u=n.n(c),l=n("nOHt"),f=n.n(l),p=n("tiWs"),d=n("374E"),h=n("PJCl"),v=n.n(h),b=n("btng"),y=u.a.createElement,m=function(t){function e(){return Object(r.a)(this,e),Object(o.a)(this,Object(i.a)(e).apply(this,arguments))}return Object(s.a)(e,t),Object(a.a)(e,[{key:"render",value:function(){return y("div",{className:"nav-fixed-top"},y(p.a,{expand:"md",className:"nav-container nav-shadow"},y("div",{className:"top-link"},y("div",{className:"logo-top-wrapper"},y(d.a,{onClick:function(){return f.a.back()},style:{color:"white"}},y(v.a,{onClick:function(){return f.a.back()}})))),y("div",{className:"header-nav-verif"},y("p",null,this.props.title))),y(b.a,null))}}]),e}(c.Component);e.a=m}},[["xTBg",0,1,2]]]);